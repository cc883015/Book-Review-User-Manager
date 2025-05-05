import { useState, useEffect } from 'react';
import { AppShell, Container, Group, Anchor, Text, Avatar } from '@mantine/core';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

function Layout() {
  const [active, setActive] = useState('/');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // 根据当前路径设置活动链接
  useEffect(() => {
    setActive(location.pathname);
  }, [location]);

  // 检查用户是否已登录
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setIsAuthenticated(true);
        setIsAdmin(decoded.is_admin);
        setUsername(decoded.username || 'role');
      } catch (error) {
        console.error('Invalid token:', error);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  }, []);

  // 登出函数
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate('/'); // 登出后重定向到首页
  };

  const getLinks = () => {
    const links = [
      { link: '/', label: 'Home🏠' },
      { link: '/books', label: 'Books📖' },
    ];
    if (isAuthenticated) {
      links.push({ link: '/my-reviews', label: 'My Reviews📒' });
    }
    if (isAdmin) {
      links.push({ link: '/users', label: 'User Management💻' });
    }
    links.push({ link: '/about', label: 'introdution📄' });
    return links;
  };

  // active 来加粗当前项
  const navLinks = getLinks().map((link) => (
    <Anchor
      key={link.label}
      component={Link}
      to={link.link}
      onClick={() => setActive(link.link)}
      style={{
        marginRight: 20,
        color: active === link.link ? 'blue' : 'gray',
        fontWeight: active === link.link ? 700 : 400, // 加粗
      }}
    >
      {link.label}
    </Anchor>
  ));

  return (
    <AppShell padding="md" header={{ height: 60, padding: 'md' }}>
      {/* 头部导航 */}
      <AppShell.Header>
        <Container size="lg">
          <Group position="apart">
            <Text size="xl" weight={700} color="green">
              📖Book Review System📖
            </Text>

            <Group spacing="xs" align="center">
              {navLinks}

              {!isAuthenticated ? (
                <>
                  <Anchor component={Link} to="/login" color="blue">
                    Login🏠
                  </Anchor>
                  <Anchor component={Link} to="/register" color="blue">
                    Register 📓
                  </Anchor>
                </>
              ) : (
                <Group spacing="xs">
                  <Avatar color="blue" radius="xl" size="sm">
                    {username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Text size="sm">
                    {isAdmin ? 'Admin' : 'User'}: {username}
                  </Text>
                  <Anchor component="button" onClick={handleLogout}>
                    Logout ⏏️
                  </Anchor>
                </Group>
              )}
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      {/* 主体内容 */}
      <AppShell.Main>
        <Container size="lg" py="md">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default Layout;
