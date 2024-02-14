/**
 * A class representing a service that processes the data for match schedule
 * and generates leaderboard.
 * 
 * NOTE: MAKE SURE TO IMPLEMENT ALL EXISITNG METHODS BELOW WITHOUT CHANGING THE INTERFACE OF THEM, 
 *       AND PLEASE DO NOT RENAME, MOVE OR DELETE THIS FILE.  
 * 
 *       ADDITIONALLY, MAKE SURE THAT ALL LIBRARIES USED IN THIS FILE FILE ARE COMPATIBLE WITH PURE JAVASCRIPT
 * 
 */
class LeagueService {

    constructor(apiUrl, token) {
        this.apiUrl = apiUrl;
        this.token = token;
    }

    /**
     * Sets the match schedule.
     * Match schedule will be given in the following form:
     * [
     *      {
     *          matchDate: [TIMESTAMP],
     *          stadium: [STRING],
     *          homeTeam: [STRING],
     *          awayTeam: [STRING],
     *          matchPlayed: [BOOLEAN],
     *          homeTeamScore: [INTEGER],
     *          awayTeamScore: [INTEGER]
     *      },
     *      {
     *          matchDate: [TIMESTAMP],
     *          stadium: [STRING],
     *          homeTeam: [STRING],
     *          awayTeam: [STRING],
     *          matchPlayed: [BOOLEAN],
     *          homeTeamScore: [INTEGER],
     *          awayTeamScore: [INTEGER]
     *      }    
     * ]
     * 
     * @param {Array} matches List of matches.
     */
    async setMatches(matches) {
        try {
            const response = await fetch(`${this.apiUrl}/getAllMatches`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(matches)
            });
            if (!response.ok) {
                throw new Error('Failed to set matches');
            }
        } catch (error) {
            console.error('Error setting matches:', error);
            throw error;
        }
    }
    /**
     * Returns the full list of matches.
     * 
     * @returns {Array} List of matches.
     */
    async getMatches() {
        try {
            const response = await fetch(`${this.apiUrl}/getAllMatches`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch matches');
            }
            const data = await response.json();
            return data.matches;
        } catch (error) {
            console.error('Error fetching matches:', error);
            throw error;
        }
    }
    /**
     * Returns the leaderboard in a form of a list of JSON objecs.
     * 
     * [     
     *      {
     *          teamName: [STRING]',
     *          matchesPlayed: [INTEGER],
     *          goalsFor: [INTEGER],
     *          goalsAgainst: [INTEGER],
     *          points: [INTEGER]     
     *      },      
     * ]       
     * 
     * @returns {Array} List of teams representing the leaderboard.
     */
    async getLeaderboard() {
        try {
            const matches = await this.getMatches();
            const teams = {};
    
            // Calcula estatísticas de equipe
            matches.forEach(match => {
                this.updateTeamStats(teams, match.homeTeam, match.matchPlayed, match.homeTeamScore, match.awayTeamScore);
                this.updateTeamStats(teams, match.awayTeam, match.matchPlayed, match.awayTeamScore, match.homeTeamScore);
            });
            
            // Ordena as equipes pelo número de pontos
            const leaderboard = Object.values(teams).sort((a, b) => {
                // Primeiro critério de desempate: pontos em partidas diretas
                if (a.pointsDirect !== b.pointsDirect) {
                    return b.pointsDirect - a.pointsDirect;
                }
                // Segundo critério de desempate: diferença de gols
                if (a.goalDifference !== b.goalDifference) {
                    return b.goalDifference - a.goalDifference;
                }
                // Terceiro critério de desempate: gols marcados
                if (a.goalsFor !== b.goalsFor) {
                    return b.goalsFor - a.goalsFor;
                }
                // Critério final de desempate: ordem alfabética ascendente pelo nome da equipe
                return a.teamName.localeCompare(b.teamName);
            });
    
            return leaderboard;
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            throw error;
        }
    }
    

    updateTeamStats(teams, teamName, matchesPlayed, goalsFor, goalsAgainst) {
        teams[teamName] = teams[teamName] || {
            teamName,
            matchesPlayed: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0, // Adiciona a nova estatística: Diferença de Gols (GD)
            points: 0
        };

        const team = teams[teamName];
        team.matchesPlayed += matchesPlayed;
        team.goalsFor += goalsFor;
        team.goalsAgainst += goalsAgainst;
        team.goalDifference = team.goalsFor - team.goalsAgainst; // Calcula a diferença de gols (GD)

        // Calcula os pontos com base nos resultados das partidas
        if (goalsFor > goalsAgainst) {
            team.points += 3; // Vitória
        } else if (goalsFor === goalsAgainst) {
            team.points += 1; // Empate
        }
        // Não há pontos atribuídos em caso de derrota, pois é representado pela ausência de pontos.
    }
    /**
     * Asynchronic function to fetch the data from the server.
     */
    async fetchData() {
        try {
            await Promise.all([this.getMatches(), this.getLeaderboard()]);
            console.log('Data fetched successfully');
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }
}

export default LeagueService;