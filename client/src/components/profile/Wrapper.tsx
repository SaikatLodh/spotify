import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Profile from "./Profile";
import ChangePassword from "./ChangePassword";
import DeleteAccount from "./DeleteAccount";

const tabs = [
  {
    name: "Profile",
    value: "Profile",
    component: <Profile />,
  },
  {
    name: "Change Password",
    value: "Change Password",
    component: <ChangePassword />,
  },
  {
    name: "Delete Account",
    value: "Delete Account",
    component: <DeleteAccount />,
  },
];
const Wrapper = () => {
  return (
    <>
      <Tabs
        defaultValue={tabs[0].value}
        className=" w-full h-full flex justify-center items-center px-20 mt-10"
      >
        <TabsList className="w-full p-0 bg-transparent justify-start border-b rounded-none cursor-pointer">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className=" cursor-pointer rounded-none data-[state=active]:bg-[#4caf50] h-full data-[state=active]:shadow-none border border-transparent border-b-border data-[state=active]:border-border data-[state=active]:border-b-background -mb-[2px] rounded-t data-[state=active]:text-white"
            >
              <h6 className="text-[18px]">{tab.name}</h6>
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="text-white md:w-[60%] w-full"
          >
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};

export default Wrapper;
