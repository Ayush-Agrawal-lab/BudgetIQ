# Render Deployment Guide

This guide will help you deploy the BudgetIQ backend on Render.

## Prerequisites

1. A Render account (sign up at https://render.com)
2. Your GitHub repository connected to Render
3. Supabase project set up and running
4. Arcjet API key

## Deployment Steps

### 1. Environment Variables

First, gather all your environment variables:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-service-key
JWT_SECRET=your-jwt-secret
ARCJET_API_KEY=your-arcjet-api-key
CORS_ORIGINS=https://ayush-agrawal-lab.github.io
```

### 2. Deploy on Render

1. Log in to your Render dashboard
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: budgetiq-backend
   - Environment: Python
   - Region: Singapore (or closest to your users)
   - Branch: main
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`

5. Add environment variables in Render dashboard:
   - Add all variables from step 1
   - Make sure to keep them secret

### 3. Verify Deployment

1. Wait for the deployment to complete
2. Check the deployment logs for any errors
3. Test the API endpoints:
   - Health check: `https://your-app.onrender.com/`
   - API test: `https://your-app.onrender.com/api/auth/login`

### 4. Update Frontend

Update your frontend environment variables:
```env
REACT_APP_BACKEND_URL=https://your-app.onrender.com
PUBLIC_URL=https://ayush-agrawal-lab.github.io/BudgetIQ
```

## Troubleshooting

1. If deployment fails:
   - Check build logs
   - Verify environment variables
   - Ensure all dependencies are in requirements.txt

2. If API calls fail:
   - Check CORS settings
   - Verify Supabase connection
   - Check Arcjet integration

3. Common issues:
   - Cold starts on free tier
   - Memory limits
   - Timeout issues

## Monitoring

1. Use Render dashboard to:
   - Monitor logs
   - Check resource usage
   - Set up alerts

2. Health checks:
   - Automatic health monitoring
   - Custom metrics tracking

## Support

If you encounter any issues:
1. Check Render documentation
2. Review application logs
3. Contact support if needed

## Security Notes

1. Keep environment variables secure
2. Regular security updates
3. Monitor API usage
4. Review access logs