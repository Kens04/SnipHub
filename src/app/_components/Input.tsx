import * as React from "react";

export type InputProps = React.ComponentProps<"input">;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, ...props }, ref) => {
    return (
      <input
        type={type}
        className="bg-gray-50 border border-gray-300 text-text-black text-sm rounded-lg focus:ring-color-primary focus:border-color-primary block w-full p-2.5"
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
