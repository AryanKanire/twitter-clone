import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


const useUpdateuserprofile = ()=>{
    
    const queryclient = useQueryClient();
	const {mutateAsync:updateprofile, isPending: isupdatingprofile} = useMutation({
		mutationFn : async (formData)=>{
			try {
				const res = await fetch("/api/users/update",{
					method:"POST",
					headers:{
						"Content-Type":"application/json",
					},
					body : JSON.stringify(formData),
				})

				const data = await res.json();

				if(!res.ok){
					throw new Error(data.error || "Something went wrong");
				}

				return data;

			} catch (error) {
				console.error("Error updating profile:", error);
				throw new Error(error.message);
			}
		},
		onSuccess: ()=>{
			toast.success("Profile updated succefuly");
			Promise.all([
				queryclient.invalidateQueries({queryKey:["authUser"]}),
				queryclient.invalidateQueries({queryKey:["userprofile"]})
			])
		},
		onError:(error)=>{
			toast.error(error.message)
		}
	});

    return {updateprofile , isupdatingprofile};
}

export default useUpdateuserprofile