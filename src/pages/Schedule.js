import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import LeagueService from './../services/LeagueService';
import { format } from 'date-fns';

function Schedule() {
    const [matches, setMatches] = useState([]);
    const [countryFlags, setCountryFlags] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const apiUrl = 'http://localhost:3001/api/v1';
            const token = 'YuHBdSlDXY000xa8IlCm7Qgq4_s';
            const leagueService = new LeagueService(apiUrl, token);

            try {
                const matchesData = await leagueService.getMatches();
                setMatches(matchesData);

                // Obtém as URLs das bandeiras dos países
                const flags = {};
                await Promise.all(matchesData.map(async (match) => {
                    const homeFlagUrl = await getCountryFlagUrl(match.homeTeam);
                    const awayFlagUrl = await getCountryFlagUrl(match.awayTeam);
                    flags[match.homeTeam] = homeFlagUrl;
                    flags[match.awayTeam] = awayFlagUrl;
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
            <h1 className="text-gray-600 text-2xl font-bold mb-4 text-center">League Schedule</h1>

            <table className="w-full mx-auto divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 w-1/6">Date/Time</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 w-1/5">Stadium</th>
                        <th className="px-6 py-3 text-rigth text-sm font-bold text-gray-500 w-1/6">Home Team</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 w-1/6">Away Team</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {matches.map((match, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-400">{format(new Date(match.matchDate), 'd.M.yyyy HH:mm')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-400">{match.stadium}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                                <div className="flex items-center justify-end">
                                    <p>{match.homeTeam}</p>

                                    <div className="flex items-center mr-5 ml-5">
                                        <img src={countryFlags[match.homeTeam]} className="h-8 mr-2" alt="Country Flag" />
                                    </div>
                                    <p>{match.homeTeamScore}</p>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                                <div className="flex items-center justify-start">
                                    <p>{match.awayTeamScore}</p>

                                    <div className="flex items-center mr-5 ml-5">
                                        <img src={countryFlags[match.awayTeam]} className="h-8 mr-2" alt="Country Flag" />

                                    </div>
                                    <p>{match.awayTeam}</p>
                                </div>
                            </td>


                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}

export default Schedule;
