# Reported incident: signed-in users are redirected to sign up

**Status:** Reported; reproduction pending  
**Affected area:** Authentication and navigation  
**Source:** Team-reported behavior  
**External tracker:** No URL provided

## Summary

The site redirects a user to the sign-up page even though that user is already signed in.

## User impact

An authenticated user cannot continue to the intended part of the site and may be prompted to create an account unnecessarily.

## Reproduction information

The team reports that the redirect occurs during the site's workflow. The exact starting route and navigation steps have not yet been recorded, and this behavior has not been independently reproduced.

To confirm and refine this report, record:

1. The route opened before the redirect.
2. The route the user expected to reach.
3. Whether the sign-in session is still valid when the redirect occurs.
4. The actual and expected results.

## Expected result

An already authenticated user should continue to the intended page rather than being sent to sign up.

## Done when

- The redirect is reproduced with exact steps.
- An authenticated user can reach the intended page.
- An unauthenticated user is still directed through the appropriate sign-in flow.
- The behavior is covered by a suitable test.
