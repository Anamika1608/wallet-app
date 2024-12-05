'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from "next/dynamic";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    UserCircle2, 
    Wallet, 
    MoreHorizontal 
  } from 'lucide-react';
  import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

interface Wallet {
  id: string;
  userId: string;
  balance: number;
  status: 'active' | 'inactive';
}

const AdminDashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([
      { 
        id: '1', 
        name: 'John Doe', 
        email: 'john@example.com', 
        status: 'active' 
      },
      { 
        id: '2', 
        name: 'Jane Smith', 
        email: 'jane@example.com', 
        status: 'inactive' 
      }
    ]);
  
    const [wallets, setWallets] = useState<Wallet[]>([
      { 
        id: '1', 
        userId: '1', 
        balance: 5000, 
        status: 'active' 
      },
      { 
        id: '2', 
        userId: '2', 
        balance: 3000, 
        status: 'inactive' 
      }
    ]);
  
    const [loading, setLoading] = useState(false);
    const [newUser, setNewUser] = useState({
      name: '',
      email: '',
      password: ''
    });

    const handleCreateUser = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/users', newUser, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            setUsers([...users, response.data]);

            setNewUser({ name: '', email: '', password: '' });

            toast.success('User created successfully');
        } catch (error) {
            toast.error('Failed to create user');
        } finally {
            setLoading(false);
        }
    };
    

  useEffect(() => {
    fetchUsers();
    fetchWallets();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/wallets', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setWallets(response.data);
    } catch (error) {
      toast.error('Failed to fetch wallets');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: 'activate' | 'deactivate' | 'delete') => {
    try {
      setLoading(true);
      switch(action) {
        case 'activate':
          await axios.patch(`/api/users/${userId}/activate`, {}, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          break;
        case 'deactivate':
          await axios.patch(`/api/users/${userId}/deactivate`, {}, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          break;
        case 'delete':
          await axios.delete(`/api/users/${userId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          break;
      }
      fetchUsers(); // Refresh users after action
      toast.success(`User ${action}d successfully`);
    } catch (error) {
      toast.error(`Failed to ${action} user`);
    } finally {
      setLoading(false);
    }
  };

  const handleWalletAction = async (walletId: string, action: 'toggle' | 'delete') => {
    try {
      setLoading(true);
      switch(action) {
        case 'toggle':
          await axios.patch(`/api/wallets/${walletId}/toggle-status`, {}, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          break;
        case 'delete':
          await axios.delete(`/api/wallets/${walletId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          break;
      }
      fetchWallets();
      toast.success(`Wallet ${action}d successfully`);
    } catch (error) {
      toast.error(`Failed to ${action} wallet`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <UserCircle2 className="mr-3 text-blue-600" /> Admin Dashboard
      </h1>
      
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">
            <UserCircle2 className="mr-2" /> Users
          </TabsTrigger>
          <TabsTrigger value="wallets">
            <Wallet className="mr-2" /> Wallets
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
          <CardHeader>
              <CardTitle className="flex justify-between items-center">
                User Management
                <Dialog>
                  <DialogTrigger asChild>
                    <Button disabled={loading}>
                      Add New User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New User</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Username
                        </Label>
                        <Input 
                          id="name" 
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                          className="col-span-3" 
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input 
                          id="email" 
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          className="col-span-3" 
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                          Password
                        </Label>
                        <Input 
                          id="password" 
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                          className="col-span-3" 
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        onClick={handleCreateUser}
                        disabled={loading || !newUser.name || !newUser.email || !newUser.password}
                      >
                        Create User
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className={`
                          px-2 py-1 rounded-full text-xs 
                          ${user.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                          }
                        `}>
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={loading}>
                              <MoreHorizontal />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>User Actions</AlertDialogTitle>
                              <AlertDialogDescription>
                                Select an action for {user.name}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <div className="flex space-x-2">
                                <Button 
                                  onClick={() => handleUserAction(user.id, user.status === 'active' ? 'deactivate' : 'activate')}
                                  disabled={loading}
                                  variant={user.status === 'active' ? 'destructive' : 'default'}
                                >
                                  {user.status === 'active' ? 'Deactivate' : 'Activate'}
                                </Button>
                                <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-red-500 hover:bg-red-600"
                                  onClick={() => handleUserAction(user.id, 'delete')}
                                  disabled={loading}
                                >
                                  Delete User
                                </AlertDialogAction>
                              </div>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="wallets">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Wallet ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wallets.map((wallet) => (
                    <TableRow key={wallet.id}>
                      <TableCell>{wallet.id}</TableCell>
                      <TableCell>
                        {users.find(u => u.id === wallet.userId)?.name || 'Unknown'}
                      </TableCell>
                      <TableCell>${wallet.balance.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`
                          px-2 py-1 rounded-full text-xs 
                          ${wallet.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                          }
                        `}>
                          {wallet.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={loading}>
                              <MoreHorizontal />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Wallet Actions</AlertDialogTitle>
                              <AlertDialogDescription>
                                Select an action for Wallet {wallet.id}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <div className="flex space-x-2">
                                <Button 
                                  onClick={() => handleWalletAction(wallet.id, 'toggle')}
                                  disabled={loading}
                                  variant={wallet.status === 'active' ? 'destructive' : 'default'}
                                >
                                  {wallet.status === 'active' ? 'Deactivate' : 'Activate'}
                                </Button>
                                <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-red-500 hover:bg-red-600"
                                  onClick={() => handleWalletAction(wallet.id, 'delete')}
                                  disabled={loading}
                                >
                                  Delete Wallet
                                </AlertDialogAction>
                              </div>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false });
