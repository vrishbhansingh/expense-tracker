<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rules\Password as PasswordRule;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', PasswordRule::defaults()],
            'currency' => ['nullable', 'string', 'size:3'],
            'timezone' => ['nullable', 'string', 'max:50'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'currency' => $data['currency'] ?? 'USD',
            'timezone' => $data['timezone'] ?? 'UTC',
        ]);

        // Seed default categories
        $this->seedDefaultCategories($user);

        $token = $user->createToken('mobile')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Account created successfully',
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (! Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('mobile')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out']);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => ['required', 'email']]);
        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => __($status)])
            : response()->json(['message' => __($status)], 400);
    }

    private function seedDefaultCategories(User $user): void
    {
        $defaults = [
            ['name' => 'Food & Dining', 'icon' => 'restaurant', 'color' => '#EF4444'],
            ['name' => 'Transportation', 'icon' => 'car', 'color' => '#3B82F6'],
            ['name' => 'Shopping', 'icon' => 'shopping_bag', 'color' => '#F59E0B'],
            ['name' => 'Entertainment', 'icon' => 'movie', 'color' => '#8B5CF6'],
            ['name' => 'Bills & Utilities', 'icon' => 'receipt', 'color' => '#10B981'],
            ['name' => 'Healthcare', 'icon' => 'medical', 'color' => '#EC4899'],
            ['name' => 'Education', 'icon' => 'school', 'color' => '#6366F1'],
            ['name' => 'Travel', 'icon' => 'flight', 'color' => '#14B8A6'],
            ['name' => 'Other', 'icon' => 'category', 'color' => '#6B7280'],
        ];

        foreach ($defaults as $cat) {
            $user->categories()->create($cat);
        }
    }
}
