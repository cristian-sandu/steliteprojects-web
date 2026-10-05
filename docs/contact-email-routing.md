# Public contact email forwarding

Requested: contact@steliteprojects.com → steliteprojects@gmail.com using free Cloudflare Email Routing.

On 5 October 2026, the destination address was registered and Cloudflare sent its verification email. The user confirmed the recipient had not clicked the link yet. Cloudflare rejects routing-rule creation until the destination is verified (error 2054). The domain's missing apex mail DNS records were installed through Cloudflare's routing DNS endpoint; routing status is ready. No existing apex MX provider was replaced, and the forms subdomain was retained.

The website email change is prepared and checked on this branch. Activate the exact-address forwarding rule after checking destination verification, then deploy the public email update. Catch-all routing is not enabled. The existing form delivery recipient remains cristian.sandu.connect@gmail.com; changing form delivery is a separate configuration change.

Website deployment must wait until the forwarding rule is successfully created so visitors are not directed to an inactive email address.
