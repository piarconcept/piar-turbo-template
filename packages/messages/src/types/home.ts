/**
 * Backoffice public home page messages.
 */
export interface HomeMessages {
  title: string;
  subtitle: string;
  signIn: string;
  requestAccess: string;
  features: {
    title: string;
    users: {
      title: string;
      description: string;
    };
    analytics: {
      title: string;
      description: string;
    };
    settings: {
      title: string;
      description: string;
    };
  };
  cta: {
    title: string;
    description: string;
    button: string;
  };
}
