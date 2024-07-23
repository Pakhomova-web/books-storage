import { useAuth } from '@/components/auth-context';

export default function Home() {
    const { user } = useAuth();

    return (
        <div>Something will be here: {user?.email}</div>
    );
}