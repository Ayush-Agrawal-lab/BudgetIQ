import { useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';
import { useLocation, popularLocations } from './LocationContext';
import { 
  Bell, 
  Sun, 
  Moon, 
  User, 
  Settings, 
  LogOut,
  CreditCard,
  MapPin,
  Edit3,
  Check
} from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export function Header({ isDarkMode, onToggleTheme, onLogout, onNavigate }: HeaderProps) {
  const { selectedLocation, setSelectedLocation } = useLocation();
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [customLocation, setCustomLocation] = useState('');

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setIsLocationDialogOpen(false);
  };

  const handleCustomLocationSubmit = () => {
    if (customLocation.trim()) {
      setSelectedLocation(customLocation.trim());
      setCustomLocation('');
      setIsLocationDialogOpen(false);
    }
  };

  return (
    <header className="h-16 border-b border-border/50 bg-card/50 backdrop-blur-sm px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">B</span>
          </div>
          <div>
            <h1 className="text-base font-semibold text-foreground">BudgetIQ</h1>
            <p className="text-xs text-muted-foreground">From Insight to Foresight</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Location Selector */}
        <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors px-2 py-1 h-auto"
              title="Change location"
            >
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{selectedLocation}</span>
              <Edit3 className="h-3 w-3 opacity-60" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Set Your Location</DialogTitle>
              <DialogDescription>
                Choose your location to personalize your BudgetIQ experience.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Popular Locations */}
              <div>
                <Label className="text-sm font-medium">Popular Locations</Label>
                <div className="grid grid-cols-1 gap-2 mt-2 max-h-60 overflow-y-auto">
                  {popularLocations.map((location) => (
                    <Button
                      key={location}
                      variant={selectedLocation === location ? "default" : "ghost"}
                      className="justify-start h-auto py-2 px-3"
                      onClick={() => handleLocationSelect(location)}
                    >
                      <div className="flex items-center space-x-2">
                        {selectedLocation === location && <Check className="h-4 w-4" />}
                        <span className="text-sm">{location}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Location */}
              <div className="space-y-2">
                <Label htmlFor="custom-location" className="text-sm font-medium">
                  Or enter a custom location
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="custom-location"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    placeholder="e.g., Stockholm, Sweden"
                    onKeyPress={(e) => e.key === 'Enter' && handleCustomLocationSubmit()}
                  />
                  <Button 
                    onClick={handleCustomLocationSubmit}
                    disabled={!customLocation.trim()}
                    size="sm"
                  >
                    Set
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleTheme}
          className="h-9 w-9 p-0"
          aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Moon className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 w-9 p-0 relative"
              aria-label="Notifications (3 unread)"
              title="Notifications"
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                aria-label="3 unread notifications"
              >
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-3 border-b border-border">
              <h3 className="font-medium">Notifications</h3>
            </div>
            <div className="p-2">
              <div className="p-3 rounded-lg bg-muted/50 mb-2">
                <p className="text-sm font-medium">Overspending Alert</p>
                <p className="text-xs text-muted-foreground">You've spent 15% more on dining this month</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 mb-2">
                <p className="text-sm font-medium">Savings Goal</p>
                <p className="text-xs text-muted-foreground">You're 80% toward your vacation fund goal!</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium">Monthly Report</p>
                <p className="text-xs text-muted-foreground">Your financial summary is ready</p>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="relative h-9 w-9 rounded-full p-0"
              aria-label="User menu"
              title="Profile and settings"
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">Alex Chen</p>
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  alex.chen@example.com
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onNavigate('settings')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate('settings')}>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate('settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}