import { useEffect, useState } from 'react';
import { Href, Redirect } from 'expo-router';
import { container } from '@/src/di/container';
import '@/src/di/providers';
import type { GetLocalUserUseCase } from '@/src/domain/usecases/GetLocalUserUseCase';

export default function Entry() {
    const [dest, setDest] = useState<Href | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const getLocalUserUseCase = container.resolve<GetLocalUserUseCase>('getLocalUserUseCase');
                const user = await getLocalUserUseCase.execute();
                if (!mounted) return;
                setDest(user ? '/(tabs)' : '/(tabs)/onboarding' as Href);
            } catch {
                if (mounted) setDest('/(tabs)');
            }
        })();
        return () => { mounted = false; };
    }, []);

    if (!dest) return null;
    return <Redirect href={dest} />;
}


