import Head from "next/head"
import React from "react"
import { useRouter } from "next/router"
import { useEffect } from "react"
import BrandHeader from "../../../components/BrandHeader"
import PrivateRouteForTeachers from "../../../components/PrivateRouteForTeachers"
import { useResponses } from "../../../contexts/ResponsesContext"
import { List, ListItem, ListItemText, Container, ListItemButton, ListItemIcon } from '@mui/material'
import { AssignmentInd, Group } from '@mui/icons-material'

const ResponsesHome = () => {
  const router = useRouter()
  const { qp_id } = router.query
  const { getList, responses } = useResponses()

  useEffect(() => {
    if (!qp_id) return
    return getList(qp_id)
  }, [qp_id])

  return (
    <>
      <Head>
        <title>[{qp_id}] Responses - MCQ Exams</title>
      </Head>
      <PrivateRouteForTeachers>
        <BrandHeader options={true} title={`[${qp_id}] Responses`} />
        <Container className='my-5'>
          <h2>
            <Group style={{ fontSize: '40px' }} />&nbsp;
            Responses
          </h2>
          <Container className='my-4'>
            <List>
              {responses.map(response => {
                const date = new Date(response.submitTimestamp).toString()

                return (
                  <ListItem sx={{ bgcolor: 'background.paper' }}>
                    <ListItemButton onClick={() => window.open(`/responses/${qp_id}/${response._id}`)}>
                      <ListItemIcon>
                        <AssignmentInd />
                      </ListItemIcon>
                      <ListItemText primary={response.studentName} secondary={`${response.studentEmail} - ${date}`} />
                    </ListItemButton>
                  </ListItem>
                )
              })}
            </List>
          </Container>
        </Container>
      </PrivateRouteForTeachers>
    </>
  )
}

export default ResponsesHome