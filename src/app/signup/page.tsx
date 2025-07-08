import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { SignUpForm } from "./_components/SignUpform";

const SignUp: React.FC = () => {
  return (
    <div className="pt-[188px]">
      <Toaster />
      <h2 className="text-center text-color-text-black text-3xl font-bold">
        新規登録
      </h2>
      <div className="flex justify-center mt-10">
        <SignUpForm />
      </div>
      <div className="text-center mt-5">
        <Link
          href="/login"
          className="underline text-color-primary transition hover:text-color-primary-hover hover:no-underline"
        >
          アカウントをお持ちの方はこちら
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
