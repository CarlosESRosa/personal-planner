<template>
    <div>
        <header class="bg-white shadow">
            <nav class="container mx-auto px-4 py-4">
                <div class="flex items-center justify-between">
                    <h1 class="text-xl font-bold text-gray-900">Personal Planner</h1>
                    <div class="flex items-center space-x-4">
                        <!-- Add navigation items here -->
                    </div>
                </div>
            </nav>
        </header>
        <main class="container mx-auto px-4 py-8">
            <slot />
        </main>
    </div>
</template>