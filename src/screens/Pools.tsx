import { useState, useEffect, useCallback } from 'react';
import { VStack, Icon, useToast, FlatList } from "native-base";
import { Octicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { PoolCard, PoolCardProps } from '../components/PoolCard';
import { EmptyPoolList } from '../components/EmptyPoolList';
import { Loading } from '../components/Loading';

import { api } from "../services/api";

const Pools = () => {

    const [pools, setPools] = useState<PoolCardProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigation = useNavigation();
    const toast = useToast();

    const getPools = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/pools');
            setPools(response.data.pools);

        } catch(error) {
            console.error(error);
            toast.show({
                title: 'Não foi possível carregar os bolões',
                placement: 'top',
                bgColor: 'red.500'
            });

        } finally {
            setIsLoading(false);
        }
    }

    useFocusEffect(useCallback(() => {
        getPools();
    }, []));

    return (
        <VStack flex={1} bgColor="gray.900">

            <Header title="Meus bolões" />

            <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
                <Button 
                    title="BUSCAR BOLÃO POR CÓDIGO"
                    leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
                    onPress={() => navigation.navigate('FindPool')}
                />
            </VStack>

            { isLoading ? (
                <Loading />
            ) : (
                <FlatList
                    data={pools}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <PoolCard data={item} onPress={() => navigation.navigate("PoolDetails", { id: item.id })} />
                    )}
                    ListEmptyComponent={() => <EmptyPoolList />}
                    _contentContainerStyle={{ pb: 10 }}

                    px={5}
                    showsVerticalScrollIndicator={false}
                />
            )}
            
        </VStack>
    );
}

export default Pools;