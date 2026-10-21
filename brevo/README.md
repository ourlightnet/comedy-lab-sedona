# Brevo setup for What on Earth!?

The header and footer images are hosted on the site, so nothing needs uploading:
- https://comedylabsedona.com/assets/email/header.png
- https://comedylabsedona.com/assets/email/collaborators.png

## Templates
Campaigns → Templates → New template → Code your own → paste
`template-comedians.html` or `template-updates.html` → Save.
Change the opening note, the opening line and the lineup each month.

`{{ contact.FIRSTNAME }}`, `{{ unsubscribe }}` and `{{ update_profile }}` are Brevo tags.
