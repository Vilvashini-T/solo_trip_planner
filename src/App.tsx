import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Home } from '@/pages/Home';
import { MyTrips } from '@/pages/MyTrips';
import { Community } from '@/pages/Community';

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/trips" element={<MyTrips />} />
                <Route path="/community" element={<Community />} />
            </Routes>
        </Layout>
    );
}

export default App;
