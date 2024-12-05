import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';

type AuthScreenProps = {
  onAuthComplete?: () => void;
};

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthComplete }) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  const handleAuth = (): void => {
    // Placeholder for authentication logic
    console.log(isLogin ? 'Login' : 'Register', { email, password, username });
    if (onAuthComplete) {
      onAuthComplete();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.title}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Text>
          
          <View style={styles.inputContainer}>
            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor="#a0a0a0"
              />
            )}
            
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#a0a0a0"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#a0a0a0"
            />
            
            <TouchableOpacity 
              style={styles.authButton} 
              onPress={handleAuth}
            >
              <Text style={styles.authButtonText}>
                {isLogin ? 'Login' : 'Register'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchText}>
              {isLogin 
                ? "Don't have an account? Register" 
                : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f8',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
  },
  innerContainer: {
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f9f9fc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e6e6ea',
  },
  authButton: {
    backgroundColor: '#6a5acd',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  authButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  switchText: {
    color: '#6a5acd',
    textAlign: 'center',
    marginTop: 15,
  },
});

export default AuthScreen;
