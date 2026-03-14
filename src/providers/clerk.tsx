import { ClerkProvider } from "@clerk/nextjs";

export const ClerkProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ClerkProvider afterMultiSessionSingleSignOutUrl="/sign-in">
      {children}
    </ClerkProvider>
  );
};
