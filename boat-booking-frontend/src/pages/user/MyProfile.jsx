import { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { getUser } from "../../api/user/users";
import UserLayout from "../../components/layouts/UserLayout";

export default function MyProfile() {
    const { userId } = useAuth();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (userId) {
            getUser(userId).then(res => setProfile(res.data));
        }
    }, [userId]);

    if (!profile) return <div>Loading...</div>;

    return (
        <UserLayout>
            <h2 className="text-xl font-semibold mb-3">My Profile</h2>
            <div className="flow-root">
            <div className="p-6 shadow-md w-xl">
                <section>
                <dl className="-my-3 divide-y divide-gray-200 text-sm *:even:bg-gray-50">
                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                    <dt className="font-medium text-gray-900">Title</dt>

                    <dd className="text-gray-700 sm:col-span-2">Mr</dd>
                    </div>

                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                    <dt className="font-medium text-gray-900">Name</dt>

                    <dd className="text-gray-700 sm:col-span-2">{profile.name}</dd>
                    </div>

                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                    <dt className="font-medium text-gray-900">Role</dt>

                    <dd className="text-gray-700 sm:col-span-2">{profile.role}</dd>
                    </div>

                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                    <dt className="font-medium text-gray-900">Joined</dt>

                    <dd className="text-gray-700 sm:col-span-2">{profile.created_at}</dd>
                    </div>

                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                    <dt className="font-medium text-gray-900">Bio</dt>

                    <dd className="text-gray-700 sm:col-span-2">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et facilis debitis explicabo
                        doloremque impedit nesciunt dolorem facere, dolor quasi veritatis quia fugit aperiam
                        aspernatur neque molestiae labore aliquam soluta architecto?
                    </dd>
                    </div>
                </dl>
                </section>
                </div>
                </div>
        </UserLayout>
    );
}