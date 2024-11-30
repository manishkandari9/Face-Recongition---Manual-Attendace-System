'use client'

import { useState, useEffect } from 'react'
import { Users, Calendar, BookOpen, Menu, UserCheck } from 'lucide-react'

// Mock API functions (replace these with your actual API calls)
const fetchRegisteredUsers = async () => {
  const response = await fetch('/api/users')
  if (!response.ok) throw new Error('Failed to fetch registered users')
  return response.json()
}

const fetchStudents = async () => {
  const response = await fetch('/api/students')
  if (!response.ok) throw new Error('Failed to fetch students')
  return response.json()
}

const fetchAttendance = async () => {
  const response = await fetch('/api/attendance')
  if (!response.ok) throw new Error('Failed to fetch attendance')
  return response.json()
}

const fetchAssignments = async () => {
  const response = await fetch('/api/assignments')
  if (!response.ok) throw new Error('Failed to fetch assignments')
  return response.json()
}

// Button Component
const Button = ({ variant = "default", size = "md", children, onClick, className = "" }) => {
  const buttonClasses = `btn ${variant === "ghost" ? "btn-ghost" : ""} ${size === "icon" ? "p-2" : "px-4 py-2"} ${className}`;
  return (
    <button className={buttonClasses} onClick={onClick}>
      {children}
    </button>
  );
}

// Tabs Components
const Tabs = ({ children, defaultValue }) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  return (
    <div>
      {children}
    </div>
  );
}

const TabsList = ({ children, className }) => {
  return (
    <div className={`flex border-b ${className}`}>
      {children}
    </div>
  );
}

const TabsTrigger = ({ value, children, onClick }) => {
  return (
    <button
      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
      onClick={() => onClick(value)}
    >
      {children}
    </button>
  );
}

const TabsContent = ({ value, children, selectedValue }) => {
  return (
    selectedValue === value ? <div>{children}</div> : null
  );
}

// Table Components
const Table = ({ children }) => {
  return (
    <table className="min-w-full table-auto">
      {children}
    </table>
  );
}

const TableHeader = ({ children }) => {
  return (
    <thead className="bg-gray-100">
      <tr>{children}</tr>
    </thead>
  );
}

const TableRow = ({ children }) => {
  return <tr>{children}</tr>;
}

const TableHead = ({ children }) => {
  return (
    <th className="px-4 py-2 text-left font-semibold text-gray-700">
      {children}
    </th>
  );
}

const TableBody = ({ children }) => {
  return <tbody>{children}</tbody>;
}

const TableCell = ({ children }) => {
  return (
    <td className="px-4 py-2 border-t border-gray-200 text-gray-700">
      {children}
    </td>
  );
}

export default function AdminPanel() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [registeredUsers, setRegisteredUsers] = useState([])
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState({
    users: true,
    students: true,
    attendance: true,
    assignments: true,
  })
  const [error, setError] = useState({
    users: null,
    students: null,
    attendance: null,
    assignments: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(prev => ({ ...prev, users: true }))
        const usersData = await fetchRegisteredUsers()
        setRegisteredUsers(usersData)
      } catch (err) {
        setError(prev => ({ ...prev, users: err.message }))
      } finally {
        setLoading(prev => ({ ...prev, users: false }))
      }

      try {
        setLoading(prev => ({ ...prev, students: true }))
        const studentsData = await fetchStudents()
        setStudents(studentsData)
      } catch (err) {
        setError(prev => ({ ...prev, students: err.message }))
      } finally {
        setLoading(prev => ({ ...prev, students: false }))
      }

      try {
        setLoading(prev => ({ ...prev, attendance: true }))
        const attendanceData = await fetchAttendance()
        setAttendance(attendanceData)
      } catch (err) {
        setError(prev => ({ ...prev, attendance: err.message }))
      } finally {
        setLoading(prev => ({ ...prev, attendance: false }))
      }

      try {
        setLoading(prev => ({ ...prev, assignments: true }))
        const assignmentsData = await fetchAssignments()
        setAssignments(assignmentsData)
      } catch (err) {
        setError(prev => ({ ...prev, assignments: err.message }))
      } finally {
        setLoading(prev => ({ ...prev, assignments: false }))
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 ease-in-out`}>
        <div className="flex items-center justify-between p-4">
          <h1 className={`text-xl font-bold ${isSidebarOpen ? 'block' : 'hidden'}`}>Admin Panel</h1>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <nav className="mt-8">
          <Button variant="ghost" className="w-full justify-start gap-4 mb-2">
            <UserCheck className="h-5 w-5" />
            {isSidebarOpen && <span>Registered Users</span>}
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-4 mb-2">
            <Users className="h-5 w-5" />
            {isSidebarOpen && <span>Students</span>}
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-4 mb-2">
            <Calendar className="h-5 w-5" />
            {isSidebarOpen && <span>Attendance</span>}
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-4 mb-2">
            <BookOpen className="h-5 w-5" />
            {isSidebarOpen && <span>Assignments</span>}
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <Tabs defaultValue="registered" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="registered">Registered Users</TabsTrigger>
            <TabsTrigger value="students">Student List</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>

          {/* Registered Users Section */}
          <TabsContent value="registered">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">Registered Users</h2>
              {loading.users ? (
                <p className="text-gray-500">Loading registered users...</p>
              ) : error.users ? (
                <p className="text-red-500">Error: {error.users}</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Last Login</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registeredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="text-right">{user.lastLogin}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {/* Student List Section */}
          <TabsContent value="students">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">Student List</h2>
              {loading.students ? (
                <p className="text-gray-500">Loading students...</p>
              ) : error.students ? (
                <p className="text-red-500">Error: {error.students}</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Name</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Course</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.id}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell className="text-right">{student.course}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {/* Attendance Section */}
          <TabsContent value="attendance">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">Attendance</h2>
              {loading.attendance ? (
                <p className="text-gray-500">Loading attendance data...</p>
              ) : error.attendance ? (
                <p className="text-red-500">Error: {error.attendance}</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Date</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.date}</TableCell>
                        <TableCell>{record.studentName}</TableCell>
                        <TableCell className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            record.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {record.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {/* Assignments Section */}
          <TabsContent value="assignments">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">Assignments</h2>
              {loading.assignments ? (
                <p className="text-gray-500">Loading assignments...</p>
              ) : error.assignments ? (
                <p className="text-red-500">Error: {error.assignments}</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Title</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead className="text-right">Submitted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.title}</TableCell>
                        <TableCell>{assignment.dueDate}</TableCell>
                        <TableCell>{assignment.course}</TableCell>
                        <TableCell className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            assignment.submitted === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {assignment.submitted}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
