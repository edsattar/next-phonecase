import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export const MaxWidthWrapper = ({ children, className }: Props) => {
  return (
    <div
      className={cn(
        "max-w-screen-xl mx-auto h-full w-full px-2.5 md:px-20",
        className,
      )}
    >
      {children}
    </div>
  );
};
