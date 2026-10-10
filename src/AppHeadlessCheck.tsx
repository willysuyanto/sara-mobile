import App from './App';

type AppHeadlessCheckProps = {
  readonly isHeadless?: boolean;
};

// On iOS the app may be launched in the background purely to handle a message.
// When that happens the root component receives `isHeadless` and must not
// render any UI. See
// https://rnfirebase.io/messaging/usage#background-application-state
function AppHeadlessCheck({ isHeadless = false }: AppHeadlessCheckProps) {
  if (isHeadless) {
    return undefined;
  }

  return <App />;
}

export default AppHeadlessCheck;
