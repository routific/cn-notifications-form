# Notification Template Customizer

A standalone React application for customizing delivery notifications (SMS and Email) with real-time compliance validation.

## Features

### Notification Types

Choose between two notification channels:
- **SMS Templates** - Text message notifications with real-time compliance validation
- **Email Templates** - Email notifications with custom subject lines and reply-to addresses

### 4 Customizable Templates

Both SMS and Email support the same notification events:
  - Delivery Scheduled
  - Out for Delivery
  - Delivery Completed
  - Delivery Missed

### SMS Features

- **Real-time Validation:**
  - Character count with GSM-7/UCS-2 encoding detection
  - SHAFT-C compliance checking (Sex, Hate, Alcohol, Firearms, Tobacco, Cannabis)
  - URL detection with deliverability warnings (URLs shown in warning message)
  - Phone number detection with spam filter warnings
  - Invalid tag detection with clear error messages
  - Excessive capitalization warnings

- **Compliance Scoring:** 0-100 score with guidance

### Email Features

- **Custom Subject Lines:** Personalize email subject with dynamic tags
- **Multi-line Body Content:** Rich text formatting support
- **Reply-To Configuration:** Set custom reply-to email address for your account
- **Dynamic Tags:** Insert customer data like name, delivery time, tracking links

### Integrations

- Slack notifications to your designated channel
- Asana task creation in your project with automatic assignment and due dates

### Easter Egg

- Hidden unicorn celebration (press Ctrl+Shift+U)
- Dancing unicorns on rainbows with sparkle effects
- Mobile-responsive magical animations

## Tech Stack

- React 18
- Vite
- Vercel (hosting + serverless functions)

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Add your environment variables to `.env`:
```
SLACK_WEBHOOK_URL=your_slack_webhook_url
ASANA_ACCESS_TOKEN=your_asana_token
ASANA_PROJECT_ID=your_project_id
ASANA_ASSIGNEE_GID=your_asana_user_gid
ASANA_COLLABORATOR_GID=collaborator_asana_user_gid
```

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

## Deployment to Vercel

### Method 1: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add `SLACK_WEBHOOK_URL`, `ASANA_ACCESS_TOKEN`, `ASANA_PROJECT_ID`
   - Optionally add `ASANA_ASSIGNEE_GID` and `ASANA_COLLABORATOR_GID`

### Method 2: Using Vercel Dashboard

1. Push your code to GitHub

2. Go to https://vercel.com and import your repository

3. Configure build settings (Vercel should auto-detect Vite):
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. Add environment variables:
   - `SLACK_WEBHOOK_URL`
   - `ASANA_ACCESS_TOKEN`
   - `ASANA_PROJECT_ID`
   - `ASANA_ASSIGNEE_GID` (optional)
   - `ASANA_COLLABORATOR_GID` (optional)

5. Deploy!

## Setting up Integrations

### Slack Webhook

1. Go to https://api.slack.com/apps
2. Create a new app or select existing
3. Enable Incoming Webhooks
4. Add webhook to your desired channel
5. Copy webhook URL and add to environment variables

### Asana

1. Generate a Personal Access Token:
   - Go to Asana settings → Apps → Manage Developer Apps
   - Create Personal Access Token

2. Find your Project ID:
   - Open your Asana project
   - Copy the project ID from the URL or use the Asana API

3. Get User GIDs (optional):
   - **Assignee GID** - User who will be assigned the task (e.g., Marc Kuo)
   - **Collaborator GID** - User who will be added as a follower and notified when task is completed (e.g., Sophie)

   You can find a user's GID by calling the Asana API:
   ```bash
   curl https://app.asana.com/api/1.0/users/me \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
   ```

   Or search for users in your workspace:
   ```bash
   curl https://app.asana.com/api/1.0/users?workspace=YOUR_WORKSPACE_GID \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
   ```

   The `gid` field in the response is what you need for both variables.

   - If `ASANA_ASSIGNEE_GID` is not set, tasks will be created unassigned
   - If `ASANA_COLLABORATOR_GID` is not set, no follower will be added

4. Add all values to environment variables

## Custom Domain (Optional)

To use a custom domain (e.g., `sms-templates.yourdomain.com`):

1. Go to your Vercel project settings
2. Navigate to Domains
3. Add your custom domain
4. Update your DNS records as instructed by Vercel

## Production Checklist

- [ ] Vercel project created and linked to repo
- [ ] Environment variables configured
- [ ] Slack webhook tested
- [ ] Asana integration tested
- [ ] Custom domain configured (optional)
- [ ] SSL certificate verified
- [ ] Mobile responsiveness tested
- [ ] Form validation tested
- [ ] Submission flow tested end-to-end

## Project Structure

```
sms-customizer/
├── api/
│   └── submit.js                      # Vercel serverless function
├── src/
│   ├── components/
│   │   ├── ComplianceScore.jsx        # SMS compliance scoring display
│   │   ├── EmailForm.jsx              # Email template form
│   │   ├── EmailInput.jsx             # Reusable email input
│   │   ├── EmailTemplateSection.jsx   # Email template editor
│   │   ├── LoadingSpinner.jsx         # Loading indicator
│   │   ├── NotificationTypeSelector.jsx # SMS vs Email chooser
│   │   ├── SMSForm.jsx                # SMS template form
│   │   ├── SuccessMessage.jsx         # Success confirmation
│   │   ├── TemplateSection.jsx        # SMS template editor
│   │   ├── UnicornCelebration.jsx     # Easter egg component
│   │   └── ValidationFeedback.jsx     # SMS validation display
│   ├── utils/
│   │   ├── emailTemplateConfig.js     # Email template configs
│   │   ├── smsValidation.js           # SMS validation logic
│   │   └── templateConfig.js          # SMS template configs
│   ├── App.jsx                        # Main app with routing
│   └── main.jsx                       # Entry point
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```

## Support

For issues or questions, contact the Routific development team.
