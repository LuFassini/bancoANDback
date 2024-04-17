import StudentsRepository  from "../models/students/StudentsRepository.js";
import  Student  from "../models/students/Student.js";


const studentsRepository = new StudentsRepository();

export const getStudents = async (req, res) => {

  const students = await studentsRepository.getStudents();

  if (students.length) {
    return res.status(200).json(students);
  }
  return res.status(200).json({
    message: "Não há estudantes cadastrados"
  });
};

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await studentsRepository.getStudentById(id);

    if (!student) {
      return res.status(404).send({
        message: "Estudante não encontrado"
      });
    }

    return res.status(200).send(student);
  } catch (err) {
    return res.status(500).send({
      message: "Erro ao buscar estudante",
      error: err.message
    });
  }
};

export const createStudent = async (req, res) => {
  const { name, age, email, code, grade } = req.body;
  const student = new Student(name, age, email, code, grade);

  await studentsRepository.addStudent(student);

  return res.status(201).send(student);
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, email, code, grade } = req.body;
    const studentById = await studentsRepository.getStudentById(id);

    if (!studentById) {
      return res.status(404).send({
        message: "Estudante não encontrado"
      });
    }

    const studentByEmail = await studentsRepository.getStudentById(email);

    if (studentByEmail && studentByEmail.id !== id) {
      return res.status(409).send({
        message: "Email já cadastrado"
      });
    }

    studentsRepository.updateStudent(id, name, age, email, code, grade);

    return res.status(200).send({ message: 'Estudante atualizado com sucesso!' });
  } catch (err) {
    return res.status(500).send({
      message: "Erro ao atualizar estudante",
      error: err.message
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await studentsRepository.getStudentById(id);

    if (!student) {
      return res.status(404).send({
        message: "Estudante não encontrado!"
      });
    }

    await studentsRepository.deleteStudent(id);
    return res.send(student);
  } catch (err) {
    return res.status(500).send({
      message: "Erro ao deletar estudante",
      error: err.message
    });
  }
};




