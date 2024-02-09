---
sidebar_position: 1
---

import DocCardList from '@theme/DocCardList';

# Qsite

This module has the same structure of any other module and also contains the master scripts to load the structure from every others modules to the project.


## Facebook

Follow these steps if you need to configure the Facebook webhook to activate WhatsApp Business:

1. Go to https://developers.facebook.com/apps/.
  - If not logged in, log in.
2. Choose a product.
3. Go to the webhooks section.
4. Select "Add Subscription" or "Edit Subscription."
5. Enter the URL:
  - You can use the project's domain followed by /api/ichat/v1/provider/whatsapp/webhook.
  - If you need to connect to n8n first, use the URL https://nflow.imaginacolombia.com/webhook/whatsapp-business/webhook. You can add a webhook parameter to redirect the information to the desired URL, for example: https://nflow.imaginacolombia.com/webhook/whatsapp-business/webhook?webhook=https://nflow.imaginacolombia.com/webhook/TEST.
6. Add a verification identifier. It can be anything, but make sure to save it for future webhook modifications.
7. Click "Verify and Save." Your webhook should function correctly."

![Edit subscription](/img/webhookFacebook.png)

![Edit subscription](/img/configWebhookFacebook.png)

<DocCardList />