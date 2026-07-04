import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";

type ApiMatch = {
  externalId: string;
  name: string;
  status: string;
  beginAt: string | null;
  scheduledAt: string | null;
  league: { name: string } | null;
  serie: { fullName: string | null } | null;
  tournament: { name: string } | null;
  opponents: Array<{
    name: string;
    acronym: string | null;
  }>;
  results: Array<{
    teamExternalId: string;
    score: number;
  }>;
  games: Array<{
    order: number;
    status: string;
  }>;
  streams: Array<{
    language: string | null;
    isMain: boolean;
    isOfficial: boolean;
    rawUrl: string;
    embedUrl: string | null;
  }>;
  live: {
    supported: boolean;
    opensAt: string | null;
  };
};

type ApiResponse = {
  data: ApiMatch[];
  meta: {
    source: string;
    date: string;
    timezone: string;
  };
};

const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? "http://127.0.0.1:3333";

export default function App() {
  const [matches, setMatches] = useState<ApiMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMatches() {
      try {
        const response = await fetch(`${apiUrl}/spikes/lol/matches/today`);
        const payload = (await response.json()) as ApiResponse | { error?: { message?: string } };

        if (!response.ok) {
          throw new Error("error" in payload ? payload.error?.message : "Erro ao carregar partidas");
        }

        if (isMounted && "data" in payload) {
          setMatches(payload.data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "Erro inesperado");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadMatches();

    return () => {
      isMounted = false;
    };
  }, []);

  const headerSummary = useMemo(() => {
    const live = matches.filter((match) => match.status === "live").length;
    const scheduled = matches.filter((match) => match.status === "scheduled").length;
    const finished = matches.filter((match) => match.status === "finished").length;

    return { live, scheduled, finished };
  }, [matches]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.kicker}>League of Legends</Text>
        <Text style={styles.title}>Partidas de hoje</Text>
        <View style={styles.summaryRow}>
          <SummaryItem label="Ao vivo" value={headerSummary.live} />
          <SummaryItem label="Próximas" value={headerSummary.scheduled} />
          <SummaryItem label="Resultados" value={headerSummary.finished} />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.state}>
          <ActivityIndicator color="#65d6ad" />
          <Text style={styles.stateText}>Carregando partidas</Text>
        </View>
      ) : error ? (
        <View style={styles.state}>
          <Text style={styles.errorTitle}>Não foi possível carregar</Text>
          <Text style={styles.stateText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.externalId}
          contentContainerStyle={styles.list}
          renderItem={({ item }: { item: ApiMatch }) => <MatchCard match={item} />}
        />
      )}
    </SafeAreaView>
  );
}

function SummaryItem({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

function MatchCard({ match }: { match: ApiMatch }) {
  const startDate = match.beginAt ?? match.scheduledAt;
  const [teamA, teamB] = match.opponents;
  const [scoreA, scoreB] = match.results;
  const mainStream = match.streams.find((stream) => stream.isMain) ?? match.streams[0];

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.league}>{match.league?.name ?? "Liga indefinida"}</Text>
          <Text style={styles.tournament}>
            {[match.serie?.fullName, match.tournament?.name].filter(Boolean).join(" / ")}
          </Text>
        </View>
        <StatusBadge status={match.status} />
      </View>

      <View style={styles.scoreRow}>
        <TeamBlock name={teamA?.acronym ?? teamA?.name ?? "TBD"} score={scoreA?.score ?? 0} />
        <Text style={styles.versus}>vs</Text>
        <TeamBlock name={teamB?.acronym ?? teamB?.name ?? "TBD"} score={scoreB?.score ?? 0} align="right" />
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>{formatTime(startDate)}</Text>
        <Text style={styles.metaText}>{match.games.length} games</Text>
        <Text style={styles.metaText}>{match.live.supported ? "live data" : "sem live data"}</Text>
      </View>

      {mainStream ? (
        <Pressable style={styles.streamButton} onPress={() => Linking.openURL(mainStream.rawUrl)}>
          <Text style={styles.streamButtonText}>
            Assistir {mainStream.language ? mainStream.language.toUpperCase() : ""}
            {mainStream.isOfficial ? " oficial" : ""}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function TeamBlock({ name, score, align = "left" }: { name: string; score: number; align?: "left" | "right" }) {
  return (
    <View style={[styles.teamBlock, align === "right" && styles.teamBlockRight]}>
      <Text style={styles.teamName} numberOfLines={1}>
        {name}
      </Text>
      <Text style={styles.score}>{score}</Text>
    </View>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <View style={[styles.badge, status === "finished" && styles.badgeFinished, status === "live" && styles.badgeLive]}>
      <Text style={styles.badgeText}>{status}</Text>
    </View>
  );
}

function formatTime(value: string | null) {
  if (!value) {
    return "horário indefinido";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0b0f14"
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14
  },
  kicker: {
    color: "#65d6ad",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  title: {
    color: "#f5f7fb",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 4
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16
  },
  summaryItem: {
    flex: 1,
    backgroundColor: "#141b23",
    borderRadius: 8,
    padding: 12
  },
  summaryValue: {
    color: "#f5f7fb",
    fontSize: 20,
    fontWeight: "800"
  },
  summaryLabel: {
    color: "#9ba7b4",
    fontSize: 12,
    marginTop: 2
  },
  list: {
    padding: 14,
    paddingBottom: 28,
    gap: 12
  },
  card: {
    backgroundColor: "#121820",
    borderColor: "#22303c",
    borderWidth: 1,
    borderRadius: 8,
    padding: 14
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  league: {
    color: "#f5f7fb",
    fontSize: 14,
    fontWeight: "800"
  },
  tournament: {
    color: "#9ba7b4",
    fontSize: 12,
    marginTop: 2
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#273241",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5
  },
  badgeFinished: {
    backgroundColor: "#284232"
  },
  badgeLive: {
    backgroundColor: "#4a2020"
  },
  badgeText: {
    color: "#f5f7fb",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  scoreRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 18
  },
  teamBlock: {
    flex: 1
  },
  teamBlockRight: {
    alignItems: "flex-end"
  },
  teamName: {
    color: "#f5f7fb",
    fontSize: 19,
    fontWeight: "800"
  },
  score: {
    color: "#65d6ad",
    fontSize: 26,
    fontWeight: "900",
    marginTop: 4
  },
  versus: {
    color: "#596673",
    fontSize: 12,
    fontWeight: "800",
    marginHorizontal: 14,
    textTransform: "uppercase"
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14
  },
  metaText: {
    backgroundColor: "#0b0f14",
    borderRadius: 6,
    color: "#9ba7b4",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 5
  },
  streamButton: {
    alignItems: "center",
    backgroundColor: "#65d6ad",
    borderRadius: 7,
    marginTop: 14,
    paddingVertical: 11
  },
  streamButtonText: {
    color: "#07100c",
    fontSize: 14,
    fontWeight: "900"
  },
  state: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 24
  },
  stateText: {
    color: "#9ba7b4",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center"
  },
  errorTitle: {
    color: "#f5f7fb",
    fontSize: 18,
    fontWeight: "800"
  }
});
