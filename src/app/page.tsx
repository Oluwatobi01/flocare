import { AuthGuard } from '@/components/AuthGuard'

export default function Home() {
  return (
    <AuthGuard>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to FemCare
          </h1>
          <p className="text-gray-600">
            Your personal health companion is ready to help you track your wellness journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-pink-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Period Tracking</h3>
              <span className="text-pink-500 text-2xl">📅</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Log your period and predict future cycles
            </p>
            <a 
              href="/period" 
              className="text-pink-600 hover:text-pink-700 text-sm font-medium"
            >
              Track Period →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Symptoms</h3>
              <span className="text-purple-500 text-2xl">📊</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Monitor daily symptoms and patterns
            </p>
            <a 
              href="/symptoms" 
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Log Symptoms →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-red-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Pregnancy</h3>
              <span className="text-red-500 text-2xl">🤱</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Track pregnancy progress and development
            </p>
            <a 
              href="/pregnancy" 
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Pregnancy Mode →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Insights</h3>
              <span className="text-blue-500 text-2xl">💡</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Get personalized health recommendations
            </p>
            <a 
              href="/insights" 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View Insights →
            </a>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Upgrade to Premium</h3>
              <p className="text-sm text-gray-600">
                Unlock advanced features and personalized insights
              </p>
            </div>
            <a 
              href="/subscription" 
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-colors"
            >
              Upgrade Now
            </a>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}