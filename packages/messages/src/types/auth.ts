/**
 * Authentication-related messages used in public auth pages.
 */
export interface AuthMessages {
  login: {
    title: string;
    noAccount: string;
    signUp: string;
    email: string;
    password: string;
    rememberMe: string;
    forgotPassword: string;
    submit: string;
    loading: string;
    error: string;
  };
  register: {
    title: string;
    haveAccount: string;
    signIn: string;
    accountCode: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: string;
    termsAndConditions: string;
    submit: string;
  };
  forgotPassword: {
    title: string;
    description: string;
    rememberPassword: string;
    backToLogin: string;
    noAccount: string;
    signUp: string;
    email: string;
    submit: string;
  };
  unauthorized: {
    title: string;
    message: string;
    needHelp: string;
    contactSupport: string;
    whatHappensNext: string;
    step1: string;
    step2: string;
    step3: string;
    backToLogin: string;
    goToHome: string;
  };
}
