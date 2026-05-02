# EmailJS Setup Instructions for Shop Notifications

When a user purchases an item from the shop, an email will be sent to `onsundevelopers@gmail.com`.

## Setup Steps:

### 1. Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for a free account (allows 200 emails/month)
3. Verify your email address

### 2. Add Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose Gmail (or any email provider)
4. Connect your Gmail account or use SMTP
5. Note your **Service ID** (e.g., `service_abc123`)

### 3. Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template:

**Subject:** New Purchase on Catagame - {{item_name}}

**Body:**
```
New purchase alert!

Item Purchased: {{item_name}}
Price: {{item_price}} Catabux
Remaining Catabux: {{remaining_catabux}}
Purchase Time: {{purchase_time}}
User Info: {{user_info}}

---
This is an automated notification from Catagame Shop.
```

4. Save and note your **Template ID** (e.g., `template_xyz789`)

### 4. Get Public Key
1. Go to "Account" → "General"
2. Find your **Public Key** (e.g., `abcdefghijklmnop`)

### 5. Update shop.html
Open `public/games/shop/shop.html` and replace these placeholders:

```javascript
// Line ~310 (in the EmailJS init)
emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your actual public key

// Line ~550 (in sendPurchaseEmail function)
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
```

Replace:
- `YOUR_PUBLIC_KEY` with your EmailJS public key
- `YOUR_SERVICE_ID` with your service ID
- `YOUR_TEMPLATE_ID` with your template ID

### 6. Test
1. Save the file
2. Push to GitHub
3. Make a test purchase on your site
4. Check onsundevelopers@gmail.com for the notification email

## Email Content
Each purchase email will include:
- Item name (Partnership, Website, etc.)
- Price in Catabux
- Remaining Catabux after purchase
- Timestamp of purchase
- User information

## Free Tier Limits
- 200 emails per month
- If you need more, upgrade to a paid plan or use a different service

## Alternative: Formspree
If you prefer Formspree instead:
1. Go to https://formspree.io/
2. Create a form endpoint
3. Replace EmailJS code with Formspree fetch request

## Troubleshooting
- Check browser console for errors
- Verify all IDs are correct
- Make sure EmailJS service is active
- Check spam folder for test emails
