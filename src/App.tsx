import { useEffect, useState } from 'react';
import { Clock, Globe2, AlertCircle, Moon, Sun } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const locations = [
  { city: "Amsterdam", timezone: "Europe/Amsterdam" },
  { city: "Andorra", timezone: "Europe/Andorra" },
  { city: "Athens", timezone: "Europe/Athens" },
  { city: "Berlin", timezone: "Europe/Berlin" },
  { city: "Brussels", timezone: "Europe/Brussels" },
  { city: "Bucharest", timezone: "Europe/Bucharest" },
  { city: "Copenhagen", timezone: "Europe/Copenhagen" },
  { city: "Dubai", timezone: "Asia/Dubai" },
  { city: "Dublin", timezone: "Europe/Dublin" },
  { city: "Helsinki", timezone: "Europe/Helsinki" },
  { city: "Lisbon", timezone: "Europe/Lisbon" },
  { city: "London", timezone: "Europe/London" },
  { city: "Los Angeles", timezone: "America/Los_Angeles" },
  { city: "Madrid", timezone: "Europe/Madrid" },
  { city: "New York", timezone: "America/New_York" },
  { city: "Paris", timezone: "Europe/Paris" },
  { city: "Prague", timezone: "Europe/Prague" },
  { city: "Rome", timezone: "Europe/Rome" },
  { city: "Singapore", timezone: "Asia/Singapore" },
  { city: "Sofia", timezone: "Europe/Sofia" },
  { city: "Stockholm", timezone: "Europe/Stockholm" },
  { city: "Sydney", timezone: "Australia/Sydney" },
  { city: "Tallinn", timezone: "Europe/Tallinn" },
  { city: "Tokyo", timezone: "Asia/Tokyo" },
  { city: "Vienna", timezone: "Europe/Vienna" },
  { city: "Warsaw", timezone: "Europe/Warsaw" },
].sort((a, b) => a.city.localeCompare(b.city));

function App() {
  const [selectedTimezone, setSelectedTimezone] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const fetchTime = async (timezone: string) => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`https://worldtimeapi.org/api/timezone/${timezone}`);
      if (!response.ok) throw new Error("Failed to fetch time");
      const data = await response.json();
      const date = new Date(data.datetime);
      
      setCurrentTime(date.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
      }));
      
      setCurrentDate(date.toLocaleDateString('en-US', {
        timeZone: timezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }));
    } catch (err) {
      setError("Unable to fetch time. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedTimezone) return;
    fetchTime(selectedTimezone);
    const interval = setInterval(() => fetchTime(selectedTimezone), 1000);
    return () => clearInterval(interval);
  }, [selectedTimezone]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDark(!isDark)}
            className="rounded-full"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600" />
            )}
          </Button>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Globe2 className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                World Time Viewer
              </h1>
            </div>
            <Select
              value={selectedTimezone}
              onValueChange={setSelectedTimezone}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(({ city, timezone }) => (
                  <SelectItem key={timezone} value={timezone}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator className="my-6" />

          {selectedTimezone && !error && (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                <Clock className="h-10 w-10 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {loading ? "Loading..." : currentTime}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-300">
                  {currentDate}
                </div>
                <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {locations.find(l => l.timezone === selectedTimezone)?.city}
                </div>
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!selectedTimezone && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <Globe2 className="h-6 w-6 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Please select a location to view its current time
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default App;