import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

const TermsAndConditions = () => {
  return (
    <ScrollArea className="h-[calc(100vh-12rem)] w-full rounded-md border p-6 bg-white">
      <div className="space-y-6 text-left">
        <h2 className="text-2xl font-bold text-gray-900">Terms and Conditions for Email and Username Data Usage</h2>
        <p className="text-gray-600">By participating in the Click Wordle game and providing your email address and username, you agree to the following terms and conditions:</p>
        
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">1. Data Collection and Purpose</h3>
          <div className="pl-4 space-y-2">
            <p><strong>What We Collect:</strong> We collect your email address and username when you sign up for or participate in the Click Wordle game.</p>
            <p><strong>Why We Collect It:</strong> This data is collected for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>To administer the Click Wordle game and personalise your gaming experience.</li>
              <li>To send you game-related notifications, updates, and information about prizes or incentives.</li>
              <li>To provide marketing updates and other promotional materials related to Click services, if you consent to receive them.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">2. Marketing Communications</h3>
          <div className="pl-4 space-y-2">
            <p>By providing your email address, you consent to receiving occasional marketing communications from Click Media Group, including newsletters, updates, and promotional offers.</p>
            <p>You can opt out of marketing communications at any time by clicking the "unsubscribe" link included in the email or by contacting us at <a href="mailto:info@clickmediagroup.co.uk" className="text-blue-600 hover:underline">info@clickmediagroup.co.uk</a>.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">3. Data Storage and Security</h3>
          <div className="pl-4 space-y-2">
            <p><strong>How Your Data Is Stored:</strong> Your data will be securely stored in compliance with applicable data protection laws, including the General Data Protection Regulation (GDPR).</p>
            <p><strong>Security Measures:</strong> We employ industry-standard security practices to protect your data from unauthorised access, loss, or misuse.</p>
            <p><strong>Access to Data:</strong> Only authorised personnel within Click Media Group have access to your data.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">4. Sharing of Data</h3>
          <div className="pl-4 space-y-2">
            <p>Your data will not be shared, sold, or distributed to third parties without your explicit consent, except:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>When required by law or legal proceedings.</li>
              <li>If necessary for technical reasons to support the functionality of the game (e.g., server hosting providers).</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">5. Data Retention</h3>
          <div className="pl-4 space-y-2">
            <p>Your data will be retained only for as long as necessary to fulfil the purposes outlined in this document.</p>
            <p>If you withdraw your consent or request deletion of your data, we will securely delete your information within 30 days of the request.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">6. Your Rights</h3>
          <div className="pl-4 space-y-2">
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access the data we hold about you.</li>
              <li>Request corrections to inaccurate or incomplete data.</li>
              <li>Request the deletion of your data.</li>
              <li>Restrict or object to the processing of your data.</li>
              <li>Transfer your data to another service provider.</li>
            </ul>
            <p>To exercise any of these rights, please contact us at <a href="mailto:info@clickmediagroup.co.uk" className="text-blue-600 hover:underline">info@clickmediagroup.co.uk</a>.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">7. Withdrawal of Consent</h3>
          <div className="pl-4 space-y-2">
            <ul className="list-disc pl-6 space-y-1">
              <li>You can withdraw your consent for us to use your email address and username at any time.</li>
              <li>To withdraw consent, please email <a href="mailto:info@clickmediagroup.co.uk" className="text-blue-600 hover:underline">info@clickmediagroup.co.uk</a>.</li>
              <li>Withdrawal of consent may limit your ability to continue participating in the Click Wordle game or receiving related benefits.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">8. Amendments to These Terms</h3>
          <div className="pl-4 space-y-2">
            <p>Click Media Group reserves the right to update or modify these terms and conditions at any time.</p>
            <p>Any changes will be communicated to you via email, and continued use of the game will signify your acceptance of the updated terms.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">9. Contact Information</h3>
          <div className="pl-4">
            <p>For questions, concerns, or requests regarding your data, please email us at <a href="mailto:info@clickmediagroup.co.uk" className="text-blue-600 hover:underline">info@clickmediagroup.co.uk</a>.</p>
          </div>
        </section>
      </div>
    </ScrollArea>
  );
};

export default TermsAndConditions;