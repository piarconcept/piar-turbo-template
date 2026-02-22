import type { Messages } from '../types';
import { auth } from './auth';
import { common } from './common';
import { comingSoon } from './comingSoon';
import { cookies } from './cookies';
import { home } from './home';
import { legal } from './legal';
import { dashboard } from './dashboard';
import { modules } from './modules';

export const messages: Messages = {
  auth,
  common,
  comingSoon,
  cookies,
  home,
  legal,
  dashboard,
  modules,
};
