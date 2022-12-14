import { useState, useEffect } from 'react';
import { FlatList, useToast } from 'native-base';

import { Loading } from './Loading';

import { api } from '../services/api';

import { Game, GameProps } from '../components/Game';
import { EmptyMyPoolList } from './EmptyMyPoolList';

interface Props {
  	poolId: string;
	code: string;
}

export function Guesses({ poolId, code }: Props) {

	const [isLoading, setIsLoading] = useState(true);
	const [games, setGames] = useState<GameProps[]>([]);
	const [firstTeamPoints, setFirstTeamPoints] = useState('');
	const [secondTeamPoints, setSecondTeamPoints] = useState('');

    const toast = useToast();

	const handleGuessConfirm = async (gameId: string) => {
		try {
			if(!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
				return toast.show({
					title: "Informe o placar do seu palpite.",
					placement: 'top',
					bgColor: 'red.500'
				});
			}

			setIsLoading(true);
			await api.post(`/pools/${poolId}/games/${gameId}`, {
				firstTeamPoints: Number(firstTeamPoints),
				secondTeamPoints: Number(secondTeamPoints)
			});

			toast.show({
				title: "Palpite realizado com sucesso.",
				placement: 'top',
				bgColor: 'green.500'
			});

			getGames();

		} catch(error) {
			console.error(error);

			toast.show({
				title: "Não foi possível enviar o palpite.",
				placement: 'top',
				bgColor: 'red.500'
			});

		} finally {
			setIsLoading(false);
		}
	}

  	const getGames = async () => {
		try {
			setIsLoading(true);

			const response = await api.get(`/pools/${poolId}/games`);
			setGames(response.data.games);

		} catch(error) {
			console.error(error);

			toast.show({
				title: "Não foi possível carregar os jogos.",
				placement: 'top',
				bgColor: 'red.500'
			});

		} finally {
			setIsLoading(false);
		}
 	}

	useEffect(() => {
		getGames();
	}, []);

	if(isLoading) {
		return <Loading />
	}

	return (
		<FlatList 
			data={games}
			keyExtractor={(item) => item.id}
			renderItem={({ item }) => (
				<Game 
					data={item}
					setFirstTeamPoints={setFirstTeamPoints}
					setSecondTeamPoints={setSecondTeamPoints}
					onGuessConfirm={() => handleGuessConfirm(item.id)}
				/>
			)}
			_contentContainerStyle={{ pb: 10 }}
			ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
		/>
	);
}
