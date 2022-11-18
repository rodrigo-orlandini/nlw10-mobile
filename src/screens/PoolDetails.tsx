import { useState, useEffect } from 'react';
import { Share } from 'react-native';
import { VStack, useToast, HStack } from 'native-base';
import { useRoute } from '@react-navigation/native';

import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { PoolHeader } from '../components/PoolHeader';
import { EmptyMyPoolList } from '../components/EmptyMyPoolList';
import { Option } from '../components/Option';
import { Guesses } from '../components/Guesses';
import { PoolCardProps } from '../components/PoolCard';

import { api } from '../services/api';

interface RouteParams {
    id: string; 
}

const PoolDetails = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState<'guesses' | 'ranking'>('guesses');
    const [poolDetails, setPoolDetails] = useState<PoolCardProps>({} as PoolCardProps);

    const toast = useToast();
    const route = useRoute();

    const { id } = route.params as RouteParams;
    
    const handleCodeShare = async () => {
        await Share.share({
            message: poolDetails.code
        });
    }

    const getPoolDetails = async () => {
        try {
            setIsLoading(true);

            const response = await api.get(`/pools/${id}`);
            setPoolDetails(response.data.pool);

        } catch(error) {
            console.error(error);

            toast.show({
                title: "Não foi possível carregar os detalhes do bolão",
                placement: 'top',
                bgColor: 'red.500'
            });

        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getPoolDetails();
    }, [id]);

    if(isLoading) {
        return <Loading />
    }

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header 
                title={poolDetails.title} 
                showBackButton 
                showShareButton 
                onShare={handleCodeShare}
            />

            {
                poolDetails._count?.participants > 0 ? (
                    <VStack px={5} flex={1} >
                        <PoolHeader data={poolDetails} />

                        <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
                            <Option 
                                title='Seus palpites' 
                                isSelected={selectedOption === 'guesses'}
                                onPress={() => setSelectedOption('guesses')}
                            />
                            <Option 
                                title='Ranking do grupo' 
                                isSelected={selectedOption === 'ranking'}
                                onPress={() => setSelectedOption('ranking')}
                            />
                        </HStack>

                        <Guesses poolId={poolDetails.id} code={poolDetails.code} />
                    </VStack>
                ) : (
                    <EmptyMyPoolList code={poolDetails.code}/>
                )
            }

        </VStack>
    );
}

export default PoolDetails;