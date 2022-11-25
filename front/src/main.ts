import './index.css'
import { setupCounter } from './counter'
import { login_and_print_logged_user } from './fetchexample'


setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

// login_and_print_logged_user("siema", "test");