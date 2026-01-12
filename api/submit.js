export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, templates } = req.body

    if (!email || !templates) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Create Asana task first to get the task URL
    let asanaTaskUrl = null
    if (process.env.ASANA_ACCESS_TOKEN && process.env.ASANA_PROJECT_ID) {
      asanaTaskUrl = await createAsanaTask(email, templates)
    }

    // Send Slack notification with link to Asana task
    if (process.env.SLACK_WEBHOOK_URL) {
      await sendSlackNotification(email, templates, asanaTaskUrl)
    }

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Submission error:', error)
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}

async function sendSlackNotification(email, templates, asanaTaskUrl) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL

  let message = `📱 *New SMS Template Request*\n\n*Email:* ${email}\n`

  if (asanaTaskUrl) {
    message += `*Asana Task:* ${asanaTaskUrl}\n`
  }

  message += `\n*Templates Submitted:* ${templates.length}\n\n`

  templates.forEach((template) => {
    if (template.content) {
      message += `*${template.name}* (Compliance Score: ${template.score}/100)\n`
      message += `\`\`\`${template.content}\`\`\`\n`

      if (template.issues && template.issues.length > 0) {
        message += `⚠️ Issues:\n`
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
  const assigneeGid = process.env.ASANA_ASSIGNEE_GID

  let description = `SMS Template Customization Request\n\n`
  description += `Submitted by: ${email}\n`
  description += `Total templates: ${templates.length}\n\n`
  description += `==========================================\n\n`

  templates.forEach((template, index) => {
    if (template.content) {
      description += `## ${index + 1}. ${template.name}\n\n`
      description += `**Compliance Score:** ${template.score}/100\n\n`
      description += `**Template Content (Copy this to DB):**\n`
      description += `${template.content}\n\n`

      if (template.issues && template.issues.length > 0) {
        description += `**⚠️ Validation Issues:**\n`
        template.issues.forEach((issue) => {
          const emoji = issue.type === 'error' ? '❌' : '⚠️'
          description += `${emoji} ${issue.message}\n`
        })
        description += `\n`
      }

      description += `------------------------------------------\n\n`
    }
  })

  description += `\n**Action Required:**\n`
  description += `1. Review each template above\n`
  description += `2. Copy the template content to the database\n`
  description += `3. Notify ${email} when templates are activated\n`

  // Calculate tomorrow's date in YYYY-MM-DD format
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const dueDate = tomorrow.toISOString().split('T')[0]

  const taskData = {
    data: {
      name: `SMS Templates: ${email}`,
      notes: description,
      projects: [projectId],
      due_on: dueDate,
    },
  }

  // Add assignee if configured
  if (assigneeGid) {
    taskData.data.assignee = assigneeGid
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

  const responseData = await response.json()
  const taskGid = responseData.data.gid

  // Return the Asana task URL
  return `https://app.asana.com/0/0/${taskGid}/f`
}
