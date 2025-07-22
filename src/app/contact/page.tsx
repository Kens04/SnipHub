import { ContactForm } from "./_components/ContactForm";

const Contact: React.FC = () => {
  return (
    <div className="mt-[100px] md:mt-[158px] mb-[80px] md:mb-[100px] px-4 md:px-8 md:max-w-7xl m-auto">
      <h2 className="text-center text-color-text-black text-2xl md:text-3xl font-bold">
        お問い合わせ
      </h2>
      <div className="flex justify-center mt-10">
        <ContactForm />
      </div>
    </div>
  );
};

export default Contact;
