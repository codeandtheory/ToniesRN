import { container } from "@/src/di/container";
import { LocalUsersUseCase } from "@/src/domain/usecases/LocalUserUseCase";
import { useState, useEffect} from "react";


export function getUserStatus() {
const [hasUser, setHasUser] = useState(false)
const [loading, setLoading] = useState(true)

const getLocalUserUseCase = container.resolve<LocalUsersUseCase>('localUserUseCase');

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getLocalUserUseCase.execute()
        console.log("User from DB:", user);
        if (user != null) {
            console.log("User found: ", user);
            setHasUser(true)
        } else {
            console.log("User not found");
            setHasUser(false)
        }
      } catch(err) {
        console.log("Unable to fetch user: ", err);
      } finally {
        setLoading(false)
      }
    };
    checkUser();
  }, []);

  return {loading, hasUser};
}