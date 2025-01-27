// Components
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { BOOKS, breadcrumbData } from "@/constants";
import MainTop from "@/components/MainTop";

function page() {
  return (
    <div>
      <div className="relative">
        <Header />

        {/* Main */}
        <main className="main">
          <MainTop breadcrumbData={breadcrumbData.privacy} />

          {/* Updated Date */}
          <section className="section py-2">
            <div className=" ">
              <p className="text-center text-gray-500">
                Last Updated: September 15, 2021
              </p>
            </div>
          </section>

          {/* Privacy policy */}
          <section className="section py-3 text-gray-600 max-w-[1000px] mx-auto px-4 text-lg">
            <div className="">
              <div className="py-2">
                Your privacy is important to us. It is our policy to respect
                your privacy regarding any information we may collect from you
                across our website, <a href="/">https://www.example.com</a>, and
                other sites we own and operate.
              </div>
              <div className="py-2">
                We may modify this Privacy Policy at any time without any prior
                notice to you and will post the revised Privacy Policy on the
                Service. The revised Policy will be effective 180 days from when
                the revised Policy is posted in the Service and your continued
                access or use of the Service after such time will constitute
                your acceptance of the revised Privacy Policy. We therefore
                recommend that you periodically review this page.
              </div>

              <div className=" py-2">
                We only ask for personal information when we truly need it to
                provide a service to you. We collect it by fair and lawful
                means, with your knowledge and consent. We also let you know why
                we’re collecting it and how it will be used.
              </div>
              <div className=" py-2">
                We only retain collected information for as long as necessary to
                provide you with your requested service. What data we store,
                we’ll protect within commercially acceptable means to prevent
                loss and theft, as well as unauthorised access, disclosure,
                copying, use or modification.
              </div>
              <div className=" py-2">
                We don’t share any personally identifying information publicly
                or with third-parties, except when required to by law.
              </div>
              <div className=" py-2">
                Our website may link to external sites that are not operated by
                us. Please be aware that we have no control over the content and
                practices of these sites, and cannot accept responsibility or
                liability for their respective privacy policies.
              </div>
              <div className=" py-2">
                You are free to refuse our request for your personal
                information, with the understanding that we may be unable to
                provide you with some of your desired services.
              </div>
              <div className=" py-2">
                Your continued use of our website will be regarded as acceptance
                of our practices around privacy and personal information. If you
                have any questions about how we handle user data and personal
                information, feel free to contact us.
              </div>
              <div className=" py-2">
                This policy is effective as of 15 September 2021.
              </div>
            </div>
            {/* List */}
            <div className="py-2 pl-8">
              <h2 className="font-bold">1. Information We Collect:</h2>
              <p>
                We will collect and process the following personal information
                about you:
              </p>
              {/* Ordered list of numbers */}

              <ol type="1" className="pl-8">
                <li>i. Name</li>
                <li>ii. Email address</li>
                <li>iii. Phone number</li>
                <li>iv. Address</li>
                <li>v. Country</li>
              </ol>
            </div>

            {/* List */}
            <div className="py-2 pl-8">
              <h2 className="font-bold">2. How We Get Your Information:</h2>
              <p>
                We collect/receive information about you in the following
                manner:
              </p>
              {/* Ordered list of numbers */}

              <ol type="1" className="pl-8">
                <li>
                  i. When a user fills up the registration form or otherwise
                  submits personal information
                </li>
                <li>ii. Interacts with the website</li>
                <li>iii. From public sources</li>
              </ol>
            </div>
            {/* List */}
            <div className="py-2 pl-8">
              <h2 className="font-bold">3. How We Use Your Information:</h2>
              <p>
                We will use the information that we collect about you for the
                following purposes:
              </p>
              {/* Ordered list of numbers */}

              <ol type="1" className="pl-8">
                <li>i. Marketing/ Promotional</li>
                <li>ii. Creating user account</li>
                <li>iii. Customer feedback collection</li>
                <li>iv. Support</li>
                <li>v. Administration info</li>
                <li>vi. Targeted advertising</li>
                <li>vii. Manage customer order</li>
                <li>viii. Site protection</li>
                <li>ix. User to user comments</li>
                <li>x. Manage user account</li>
              </ol>

              <p className="py-2">
                If we want to use your information for any other purpose, we
                will ask you for consent and will use your information only on
                receiving your consent and then, only for the purpose(s) for
                which grant consent unless we are required to do otherwise by
                law.
              </p>
            </div>
            {/* List */}
            <div className="py-2 pl-8">
              <h2 className="font-bold">4. How We Share Your Information:</h2>
              <p className="py-2">
                We will not transfer your personal information to any third
                party without seeking your consent, except in limited
                circumstances as described below:
              </p>
              {/* Ordered list of numbers */}

              <ol type="1" className="pl-8">
                <li>i. Sponsors</li>
                <li>ii. Analytics</li>
                <li>iii. Data collection & process</li>
              </ol>

              <p className="py-2">
                We require such third party’s to use the personal information we
                transfer to them only for the purpose for which it was
                transferred and not to retain it for longer than is required for
                fulfilling the said purpose.
              </p>
              <p className="py-2">
                We may also disclose your personal information for the
                following: (1) to comply with applicable law, regulation, court
                order or other legal process; (2) to enforce your agreements
                with us, including this Privacy Policy; or (3) to respond to
                claims that your use of the Service violates any third-party
                rights. If the Service or our company is merged or acquired with
                another company, your information will be one of the assets that
                is transferred to the new owner.
              </p>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default page;
