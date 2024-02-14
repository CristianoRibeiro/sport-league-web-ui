import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import LeagueService from '../services/LeagueService';

function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [countryFlags, setCountryFlags] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const apiUrl = 'http://localhost:3001/api/v1';
            const token = 'YuHBdSlDXY000xa8IlCm7Qgq4_s';
            const leagueService = new LeagueService(apiUrl, token);

            try {
                const leaderboardData = await leagueService.getLeaderboard();
                setLeaderboard(leaderboardData);

                // Obtém as URLs das bandeiras dos países
                const flags = {};
                await Promise.all(leaderboardData.map(async (team) => {
                    const flagUrl = await getCountryFlagUrl(team.teamName);
                    flags[team.teamName] = flagUrl;
                }));
                setCountryFlags(flags);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const getCountryFlagUrl = async (countryName) => {
        try {
            const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
            const data = await response.json();
            return data[0]?.flags?.png;
        } catch (error) {
            console.error('Error fetching country flag:', error);
            return null;
        }
    };

    return (
        <Layout>
            <h1 className="text-gray-600 text-2xl font-bold mb-4 text-center">League Standings</h1>

            <table className="w-full mx-auto divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-bold text-gray-500">Team</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-gray-500">MP</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-gray-500">GF</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-gray-500">GA</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-gray-500">P</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {leaderboard.map((team, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-400 flex items-center">
                                <div className="flex items-center justify-end">
                                    <div className="flex items-center mr-5 ml-5">
                                        <img src={countryFlags[team.teamName]} className="h-8 mr-2" alt="Country Flag" />
                                    </div>
                                    {team.teamName}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-400">{team.matchesPlayed}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-400">{team.goalsFor}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-400">{team.goalsAgainst}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-400">{team.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}

export default Leaderboard;
