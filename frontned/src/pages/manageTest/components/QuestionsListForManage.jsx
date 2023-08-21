import React from 'react';
import styled from 'styled-components';
import { AiOutlineDelete } from "react-icons/ai"
import { publicRequest } from '../../../api';

const TableWrapper = styled.div`
  font-family: Arial, sans-serif;
  margin: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  background-color: #4CAF50;
  color: white;
  text-align: left;
  padding: 10px;
`;

const TableCell = styled.td`
  border-bottom: 1px solid #ddd;
  padding: 1rem 0.4rem;

  >svg{
    scale: 1.2;
  }

  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const QuestionsListForManage = ({data, setQuestionList, test}) => {

  const handleDelete = async (questionId) => {
    try {
      const {data} = await publicRequest.delete(`/test/question?qid=${questionId}&testid=${test}`)
      setQuestionList( p => p.filter(e => e.pk !== questionId ))
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <TableHeader>Type</TableHeader>
            <TableHeader>Time</TableHeader>
            <TableHeader>Skills</TableHeader>
            {/* <TableHeader>Score (75)</TableHeader> */}
            <TableHeader>Score (75)</TableHeader>
            <TableHeader>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {data.map(e => (
                    <tr>
                      <TableCell>{e.fields.title}</TableCell>
                      <TableCell>{e.fields.recommended_time}</TableCell>
                      <TableCell>{e.fields.difficulty}</TableCell>
                      <TableCell>{e.fields.title}</TableCell>
                      <TableCell><AiOutlineDelete onClick={() => handleDelete(e.pk)} /></TableCell>
                    </tr>
          ))}

          {/* Repeat the above row structure for each data entry */}
        </tbody>
      </Table>
    </TableWrapper>
  );
};

export default QuestionsListForManage;

