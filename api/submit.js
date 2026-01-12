export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, templates } = req.body

    if (!email || !templates) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Send Slack notification
    if (process.env.SLACK_WEBHOOK_URL) {
      await sendSlackNotification(email, templates)
    }

    // Create Asana task
    if (process.env.ASANA_ACCESS_TOKEN && process.env.ASANA_PROJECT_ID) {
      await createAsanaTask(email, templates)
    }

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Submission error:', error)
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}

async function sendSlackNotification(email, templates) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL

  let message = `📱 *New SMS Template Request*\n\n*Email:* ${email}\n\n`

  templates.forEach((template) => {
    if (template.content) {
      message += `*${template.name}* (Score: ${template.score}/100)\n`
      message += `\`\`\`${template.content}\`\`\`\n`

      if (template.issues && template.issues.length > 0) {
        message += `Issues:\n`
        template.issues.forEach((issue) => {
          message += `  • ${issue.message}\n`
        })
      }
      message += `\n`
    }
  })

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: message,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to send Slack notification')
  }
}

async function createAsanaTask(email, templates) {
  const accessToken = process.env.ASANA_ACCESS_TOKEN
  const projectId = process.env.ASANA_PROJECT_ID

  let description = `SMS Template Request from: ${email}\n\n`

  templates.forEach((template) => {
    if (template.content) {
      description += `**${template.name}** (Compliance Score: ${template.score}/100)\n`
      description += `Template: ${template.content}\n\n`

      if (template.issues && template.issues.length > 0) {
        description += `Issues:\n`
        template.issues.forEach((issue) => {
          description += `- ${issue.message}\n`
        })
        description += `\n`
      }
    }
  })

  const taskData = {
    data: {
      name: `SMS Template Request: ${email}`,
      notes: description,
      projects: [projectId],
    },
  }

  const response = await fetch('https://app.asana.com/api/1.0/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(taskData),
  })

  if (!response.ok) {
    throw new Error('Failed to create Asana task')
  }
}
