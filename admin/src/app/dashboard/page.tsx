'use client'
import React, { useState } from 'react';
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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  UserCircle2, 
  Wallet, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState([
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

  const [wallets, setWallets] = useState([
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

  const handleUserAction = (userId: string, action: 'activate' | 'deactivate' | 'delete') => {
    switch(action) {
      case 'activate':
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, status: 'active' } 
            : user
        ));
        break;
      case 'deactivate':
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, status: 'inactive' } 
            : user
        ));
        break;
      case 'delete':
        setUsers(users.filter(user => user.id !== userId));
        break;
    }
  };

  const handleWalletAction = (walletId: string, action: 'toggle' | 'delete') => {
    switch(action) {
      case 'toggle':
        setWallets(wallets.map(wallet => 
          wallet.id === walletId 
            ? { ...wallet, status: wallet.status === 'active' ? 'inactive' : 'active' } 
            : wallet
        ));
        break;
      case 'delete':
        setWallets(wallets.filter(wallet => wallet.id !== walletId));
        break;
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
                <Button>
                  Add New User
                </Button>
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
                            <Button variant="ghost" size="icon">
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
                                  variant={user.status === 'active' ? 'destructive' : 'default'}
                                >
                                  {user.status === 'active' ? 'Deactivate' : 'Activate'}
                                </Button>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-red-500 hover:bg-red-600"
                                  onClick={() => handleUserAction(user.id, 'delete')}
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
                            <Button variant="ghost" size="icon">
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
                                  variant={wallet.status === 'active' ? 'destructive' : 'default'}
                                >
                                  {wallet.status === 'active' ? 'Deactivate' : 'Activate'}
                                </Button>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-red-500 hover:bg-red-600"
                                  onClick={() => handleWalletAction(wallet.id, 'delete')}
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

export default AdminDashboard;