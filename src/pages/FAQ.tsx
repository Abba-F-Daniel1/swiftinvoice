import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqItems = [
  {
    question: "What is SwiftInvoice?",
    answer:
      "SwiftInvoice is a professional invoicing platform designed for freelancers and small businesses. It simplifies the process of creating, customizing, and managing invoices, ensuring a seamless billing experience."
  },
  {
    question: "How does SwiftInvoice help freelancers?",
    answer:
      "SwiftInvoice allows freelancers to quickly generate polished invoices with customizable templates. It also provides features like client management, task tracking, and integrated payment options to save time and maintain professionalism."
  },
  {
    question: "Can I upload my company logo to customize invoices?",
    answer:
      "Absolutely! SwiftInvoice supports company logo uploads, enabling you to brand your invoices and maintain a professional identity with your clients."
  },
  {
    question: "What file format are the invoices generated in?",
    answer:
      "Invoices are generated as PDF files, ensuring compatibility across devices and making it easy to share or print them."
  },
  {
    question: "Is my data secure with SwiftInvoice?",
    answer:
      "Yes, SwiftInvoice uses industry-standard encryption to protect your data, ensuring that sensitive client and payment information is secure."
  },
  {
    question: "Can I track payments through SwiftInvoice?",
    answer:
      "Yes, SwiftInvoice provides payment tracking features, allowing you to monitor invoice statuses and confirm when payments are received."
  },
  {
    question: "Does SwiftInvoice support multiple currencies?",
    answer:
      "Yes, SwiftInvoice supports multiple currencies, making it ideal for freelancers and businesses working with international clients."
  },
  
  {
    question: "Can I integrate SwiftInvoice with other tools?",
    answer:
      "SwiftInvoice is designed to integrate with popular tools and services, such as payment gateways, to enhance your invoicing process."
  },
  {
    question: "How do I get started with SwiftInvoice?",
    answer:
      "Getting started is easy! Sign up for an account, customize your settings, and begin creating professional invoices within minutes."
  }
];


const FAQ = () => {
  return (
    <div className="page-container">
      <h1 className="heading-1 text-center">Frequently Asked Questions</h1>
      
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          {faqItems.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="bg-white dark:bg-gray-800 rounded-lg">
              <AccordionTrigger className="text-lg font-medium px-6">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-300 px-6">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
export default FAQ;