# Launch notes — The Barking Lot

Everything below must be confirmed with Steve Boschen before this site goes live.

## Domain
- Canonical domain: **https://thebarkinglot.info** (already owned by the business; replaces the current early-2000s site).
  All canonical, Open Graph and sitemap URLs use it. Confirm who controls the DNS / registrar login.

## Facts to confirm
1. **Neighborhood**: the site says "on North Belmont Avenue in the Museum District". Confirm the owner is happy with "Museum District".
2. **Hours** (taken from Google): Tuesday to Friday 7:30 AM to 5:30 PM; Saturday 8:00 AM to 5:00 PM; closed Sunday and Monday.
3. **Walk-in nail trims until 2 PM**: from a recent Google review, shown as "call ahead to confirm". Confirm the cut-off time and
   which days it applies to (the site does not state days).
4. **Google rating 4.5 from 141 reviews**: shown in the trust strip and the home-page aggregateRating schema. Update the numbers at launch.
5. **Parking**: "Street parking on Belmont Avenue" (from a review).
6. **Since 1990**: BBB lists a start date of March 1, 1990 (used as `foundingDate`). The site says The Barking Lot "has served Richmond since 1990"
   and does not claim it has been at 606 N Belmont Ave the whole time.
7. **Awards**: Virginia Living Best of Virginia 2022 (1st place, Dog Groomer) with Virginia Living's quote; Richmond Magazine Editor's Pick 2010;
   County Advisory Board "TOP GUN" recognition for Steve. Confirm the exact wording he wants for the TOP GUN honor (which county, which year).
8. **Payment methods**: cash, Visa, MasterCard, debit cards and checks.
9. **Rescue organizations**: Richmond SPCA, Richmond Animal League, Richmond Animal Care and Control, For the Love of Animals (Goochland),
   AARF. Linked: richmondspca.org, ral.org, rva.gov/animal-care-control. Not linked (no confirmed official URL): For the Love of Animals, AARF.
10. **Cat services**: the site says "professional grooming for cats" without listing which specific services are offered for cats. Confirm.
11. **Vaccination policy**: not stated. The site says "Ask us about vaccination requirements". Get the actual policy and add it.
12. **Review themes** (paraphrased, never attributed): cats handled gently and calm afterwards, nail trims, experienced staff,
    reasonable prices, "old school integrity", they listen to requests. The "old school integrity" phrase is quoted from an unnamed Google review.
13. **Email**: thebarkinglotinrichva@verizon.net. Confirm it is still monitored (Verizon ended new email service; many accounts moved to AOL).
14. **Fin & Feather / Lakeside location**: the old site lists "The Barking Lot at Fin & Feather, 5208 Lakeside Ave, Henrico, (804) 262-1801".
    It is NOT on the new site because it is unconfirmed. If it is still open, add it to Visit and the JSON-LD (as a second location).
15. **Texting**: the build standard calls for sms: links, but (804) 358-4038 appears to be a landline, so no "Text us" links were added.
    If the shop has a textable number, add sms: links to the action bar and Visit page.
16. **Social profiles**: none were provided, so there are no social links and no `sameAs` in the schema. Add Facebook, Instagram or Google Business
    Profile URLs if they exist.

## Photos (credits and licensing)
- All photos come from The Barking Lot's own website and were taken by **Steve Boschen** (they carry his "S. Boschen" watermark, which was kept).
  Get Steve's written OK to reuse them on the new site.
- Photo credit on the site: "Portraits by Steve Boschen" (Regulars page) and captions on the home page.
- Staff photos were deliberately **not used** (except Steve's two portraits) because they are about 15 years old. No staff are named.
- The client portraits show customers' pets. Consider asking regular customers (or putting a note at the counter) before featuring their pets.
- Nice-to-have swaps: new, higher-resolution photos (the originals are at most about 900 px wide), more cats, a shot of the storefront and sign on Belmont.

## Form
- The appointment request form (visit.html#request) is a **Netlify Form**. It only works once deployed on Netlify.
  Set up email notifications in Netlify (Forms > Notifications) to send requests to the shop.
- The form clearly says it is a request, not a booking, and that the shop will call to confirm a time.

## Items to swap or add after launch
- Update the Google rating and review count periodically (home page trust strip + JSON-LD + llms.txt).
- Add a vaccination policy line once confirmed.
- Add social links and `sameAs` if available.
- Register the site with Google Search Console and submit `sitemap.xml`; update the Google Business Profile website link.
