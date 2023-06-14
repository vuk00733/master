import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes,useLocation, useNavigate  , Navigate} from 'react-router-dom';
import styled from 'styled-components';

const Logo = styled.h1`
width: 100px;
translate: 80px -120px;
color: white;
`;

const Form = styled.form`
  height: 300px;
  transform: translateY(-40%);
  width: 319px;
  border-radius: 14px;
  border-top: 1px solid rgba(255, 255, 255, .2);
  border-left: 1px solid rgba(255, 255, 255, .2);
  box-shadow: 10px 10px 30px rgba(0, 0, 0, .1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  `;

const Input = styled.input`
    font-weight: lighter;
    background-color: rgba(255, 255, 255, .2);
    border: 0;
    border-radius: 14px;
    border-top: 1px solid rgba(255, 255, 255, .2);
    border-left: 1px solid rgba(255, 255, 255, .2);
    outline: none;
    color: white;
    padding: 15px;
    margin: 10px;
    ::placeholder{
      color: white;
    }
`;

const Button = styled.button`
   font-weight: bolder;
    background-color: rgba(255, 255, 255, .3);
    border: 0;
    border-top: 1px solid rgba(255, 255, 255, .2);
    border-left: 1px solid rgba(255, 255, 255, .2);
    border-radius: 14px;
    outline: none;
    color: white;
    width: 241px;
    height: 43px;
    margin-top: 20px;
    margin-left: 40px;
    cursor: pointer;
    transition: background-color ease 200ms;
    :hover{
      background-color: rgba(255, 255, 255, .4);
    }
`;

const StyledLink = styled(Link)`
  margin: auto;
  color: white;
  text-decoration: none;
`;

const LoginForm = styled(Form)`
  color: #ffffff;

`;

const RegisterForm = styled(Form)`
  color: black;
`;

const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 20px;
`;

const QRCodeImage = styled.img`
  max-width: 300px;
  height: auto;
`;

const VerificationForm = styled.form`
  display: flex;
  flex-direction: column;
  transform: translateY(-40%);
  align-items: center;
  gap: 20px;
  padding: 20px;
  margin: auto;
  width: 80%;
  height: 400px;
`;

const VerifyButton = styled.button`
 font-weight: bolder;
    background-color: rgba(255, 255, 255, .3);
    border: 0;
    border-top: 1px solid rgba(255, 255, 255, .2);
    border-left: 1px solid rgba(255, 255, 255, .2);
    border-radius: 14px;
    outline: none;
    color: white;
    width: 180px;
    height: 43px;
    margin: auto;
    cursor: pointer;
    transition: background-color ease 200ms;
    :hover{
      background-color: rgba(255, 255, 255, .4);
    }
`;
// Login component
const Login = ({ onLogin, setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit  = async (e) => {
    e.preventDefault();
    onLogin({ username, password });
    setIsAuthenticated(true);
    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
      });
  
      if (!response.ok) {
        alert("Unsuccessful login please try again!")
        setUsername('');
        setPassword('');
      }
      await response.json();
      navigate('/main');
    } catch (error) {
      console.log('Error:', error.message);
    }
  };

  return (
    <> 
        <Logo>WELCOME</Logo>   
    <LoginForm onSubmit={handleSubmit}>
  <Input
    type="text"
    placeholder="Username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
  />
  <Input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  <Button type="submit">Login</Button>
  <StyledLink to="/register">Register</StyledLink>
</LoginForm></>

  );
};

//QR and verify component
const Verify = () => {
  const [code, setCode] = useState('');
  const [codeUrl, setCodeUrl] = useState('');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const handleQR = async () => {
    const responseQR = await fetch(`http://localhost:8080/api/users/generate-qr/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const dataQR = await responseQR.json();
    setCodeUrl(dataQR.code);
  }

  useEffect( ()  => {
    handleQR();
     // eslint-disable-next-line
  }, []);
  

  const handleVerify = async (e) => {
    e.preventDefault();
    try {

      const responseVerify = await fetch(`http://localhost:8080/api/users/verify-2fa`, {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({username, code})
    });
    const dataVerify = await responseVerify.json();
    console.log("verify", dataVerify);
    if (responseVerify.ok) {
      navigate('/login');
      alert("Successfully created account, please login with your credentials")
    }
    else {
      alert("Unsuccessful login please try again!");
      setCode('');
    }
    } catch (error) {
      console.log('Error:', error.message);
    };
};

  return( 
  <VerificationForm onSubmit={handleVerify}>   
    <QRCodeContainer>
       <QRCodeImage src={codeUrl} alt="QR Code" />
    </QRCodeContainer>
      <Input
        type="text"
        placeholder="Verification code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <VerifyButton type="submit">Verify</VerifyButton>
      </VerificationForm>
      )
}

// Register component
const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    onRegister({ username, password });
    try {
      const responseReg = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
      });
      await responseReg.json();
      localStorage.setItem("username", username);
      navigate('/verify');
    } catch (error) {
      console.log('Error:', error.message);
    }
  };

  
  return (
    <> 
    <Logo>REGISTER</Logo>
      <RegisterForm onSubmit={handleSubmit}>
    <Input
      type="text"
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />
    <Input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <Button type="submit">Register</Button>
    <StyledLink to="/login">Back to Login</StyledLink>
  </RegisterForm></>
   
  );
};

const Main = () => {

  return (
    <>
      <h1>
        Hello and welcome!
      </h1>
    </>
  )
}


// App component
const App = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (data) => {
    console.log('Login:', data);
  };

  const handleRegister = (data) => {
    console.log('Register:', data);
  };

  const RequireAuth = ({ children }) => {
    let location = useLocation();

    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
  }
  return (
    <Router>
      <Routes>
      <Route path='/login' element={<Login onLogin={handleLogin} setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/register" element={<Register onRegister={handleRegister} />} />
      <Route path="/verify" element={<Verify  />} />
      <Route path='/' element={<RequireAuth><Main></Main></RequireAuth>}/>
      </Routes>
    </Router>
  );
};

export default App;