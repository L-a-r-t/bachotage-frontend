import "../styles/globals.css"
import type { AppProps } from "next/app"
import { Provider } from "react-redux"
import store from "../store"
import AuthLayer from "../AuthLayer"
import Modal from "components/Modal"
import Alert from "components/Alert"
import SideModal from "components/SideModal"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AuthLayer>
        <Component {...pageProps} />
        <SideModal />
        <Modal />
        <Alert />
      </AuthLayer>
    </Provider>
  )
}

export default MyApp
