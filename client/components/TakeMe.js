import { useGlobal } from "../contexts/GlobalContext"
import { useRouter } from 'next/router'

const TakeMe = ({ path, fullReload, children }) => {
  const { progress } = useGlobal()
  const router = useRouter()

  return (
    <span onClick={() => {
      progress.show()
      if (fullReload) {
        return setTimeout(() => {
          window.location.href = path
        }, 800)
      }
      return setTimeout(() => {
        router.push(path)
      }, 800)
    }}>
      {children}
    </span>
  )
}

export default TakeMe