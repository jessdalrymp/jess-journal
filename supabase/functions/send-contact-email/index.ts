
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactMessageRequest {
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, subject, message }: ContactMessageRequest = await req.json();
    
    console.log(`Sending email from ${email} with subject: ${subject}`);

    const emailResponse = await resend.emails.send({
      from: "Jess Journal Contact <onboarding@resend.dev>",
      to: ["contactus@jess-journal.com"],
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New message from Contact Form</h2>
        <p><strong>From:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      reply_to: email,
    });

    // Send an auto-reply to the user
    await resend.emails.send({
      from: "Jess Journal <onboarding@resend.dev>",
      to: [email],
      subject: "We received your message - Jess Journal",
      html: `
        <h2>Thank you for contacting Jess Journal!</h2>
        <p>We have received your message with the subject: "${subject}".</p>
        <p>Our team will review your inquiry and get back to you as soon as possible.</p>
        <p>Best regards,<br>The Jess Journal Team</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
