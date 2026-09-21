import type { FC } from "react";

type PageHeaderProps = {
  title: string;
  description: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

export const PageHeader: FC<PageHeaderProps> = ({
  title,
  description,
  as = "h1",
}) => {
  const HeadingTag = as;
  const isH1 = as === "h1";
  const headerClassName = isH1 ? "space-y-2 pb-10" : "space-y-1";
  const headingClassName = isH1
    ? "text-2xl font-semibold tracking-tight"
    : "text-sm font-semibold tracking-tight";

  return (
    <header className={headerClassName}>
      <HeadingTag id="common-page-heading" className={headingClassName}>
        {title}
      </HeadingTag>
      <p id="common-page-description" className="max-w-2xl text-sm opacity-80">
        {description}
      </p>
    </header>
  );
};
